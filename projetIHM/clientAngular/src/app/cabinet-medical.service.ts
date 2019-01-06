import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {CabinetInterface} from './dataInterfaces/cabinet';
import {Adresse} from './dataInterfaces/adresse';
import {sexeEnum} from './dataInterfaces/sexe';
import {PatientInterface} from './dataInterfaces/patient';
import {InfirmierInterface} from './dataInterfaces/infirmier';


@Injectable()
export class CabinetMedicalService {
  private patients: PatientInterface[]; // Patients du cabinet
  private nom: string; // Nom du cabinet

  constructor(private http: Http) {
  }
  getData(url: string): Promise<CabinetInterface> {
    return this.http.get(url).toPromise().then((res: Response) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(res.text(), 'text/xml');
      if (doc) {
        this.nom = doc.querySelector('nom').innerHTML;
        const cabinet: CabinetInterface = {
          infirmiers: [],
          patientsNonAffectes: [],
          adresse: this.getAdressFrom(doc.querySelector('adresse'))
        };

        const infirmiersXML = Array.from(doc.querySelectorAll('infirmiers>infirmier'));
        cabinet.infirmiers = infirmiersXML.map(infirmierXML => {
          return {
            id: infirmierXML.getAttribute('id'),
            nom: infirmierXML.querySelector('nom').textContent,
            prenom: infirmierXML.querySelector('prénom').textContent,
            photo: infirmierXML.querySelector('photo').textContent,
            adresse: this.getAdressFrom(infirmierXML.querySelector('adresse')),
            patients: []
          };
        });
        return cabinet;
      }
      return null;
    });
  }
  getAdressFrom(root: Element): Adresse {
    let node: Element;
    return { ville: (node = root.querySelector('adresse>ville')) ? node.textContent : '',
      codePostal: (node = root.querySelector('adresse>codePostal')) ? parseInt(node.textContent, 10) : 0,
      rue: (node = root.querySelector('adresse>rue')) ? node.textContent : '',
      numero: (node = root.querySelector('adresse>numéro')) ? node.textContent : '',
      etage: (node = root.querySelector('adresse>étage')) ? node.textContent : ''
    };
  }
  getSexeFrom(root: Element): sexeEnum {
    // Si le sexe est M
    if (root.textContent === 'M') {
      // On retourne un sexeEnum M
      return sexeEnum.M;
    }
    // Si le sexe est F
    else {
      // On retourne un sexeEnum F
      return sexeEnum.F;
    }
  }

  postAffect(id: string, ss: string) {
    // Envoie de la requête post affecation/désaffectation avec l'id de l'infirmère et le num ss du patient
    this.http.post('/affectation', {infirmier: id, patient: ss}).subscribe();
  }
 postAdd(prenom: string, nom: string, nss: string, M: boolean, F: boolean, ville: string, rue: string, numero: string, etage: string, cp: string, date: string) {
    // Envoie de la requête post add avec les données du nouveau patient
    this.http.post('/addPatient', {
      patientName: nom,
      patientForname: prenom,
      patientNumber: nss,
      patientSex: (M) ? 'M' : 'F',
      patientBirthday: date,
      patientFloor: etage,
      patientStreetNumber: numero,
      patientStreet: rue,
      patientPostalCode: cp,
      patientCity: ville
    }).subscribe();
  }
  getPatients() {
    return this.patients;
  }

  getNomCabinet() {
    return this.nom;
  }
}

