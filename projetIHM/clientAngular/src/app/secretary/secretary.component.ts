/*Autors : Emre Aydin Et Cessna Jefferson*/
import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {CabinetMedicalService} from '../cabinet-medical.service';
import {CabinetInterface} from '../dataInterfaces/cabinet';
import {Http, Response} from '@angular/http';
import {PatientInterface} from '../dataInterfaces/patient';
import {sexeEnum} from '../dataInterfaces/sexe';
import {Adresse} from '../dataInterfaces/adresse';

@Component({
  selector: 'app-secretary',
  templateUrl: './secretary.component.html',
  styleUrls: ['./secretary.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SecretaryComponent implements OnInit {

  protected http: Http;
  protected cabinetService: CabinetInterface = {
    infirmiers: [],
    patientsNonAffectes: [],
    adresse: null
  };
  protected  cabinet: CabinetMedicalService;

  constructor(cabinetService: CabinetMedicalService, http: Http) {
    console.log('Secretary');
    cabinetService.getData('/data/cabinetInfirmier.xml').then(data => this.cabinetService = data);
    this.cabinet = cabinetService;
  }
  desaffectPatientDragDrop(event: PatientInterface) {
    // On appelle la méthode du cabinet pour lancer un requête de désaffectation
    this.cabinet.postAffect('none', event.numeroSecuriteSociale);
    // Desaffectation
    let patient: PatientInterface;
    let i = 0;
    // On parcourt les infirmières
    this.cabinetService.infirmiers.forEach(inf => {
      i = 0;
      // On parcout les patients de l'infirmières
      inf.patients.forEach(pat => {
        // Si le patient est affecté à l'infirmières
        if (pat.numeroSecuriteSociale === event.numeroSecuriteSociale) {
          // On le supprime
          inf.patients.splice(i, 1);
          patient = pat;
          // Et on l'ajoute aux patients non affectés
          this.cabinetService.patientsNonAffectes.push(patient);
        }
        i++;
      });
    });
  }
  addPatient(prenom: string, nom: string, nss: string, M: boolean, F: boolean, ville: string, rue: string, numero: string, etage: string, cp: string, date: string) {
    // On appelle la méthode du cabinet pour lancer un requête d'ajout de patient
    console.log(etage);
    this.cabinet.postAdd(prenom, nom, nss, M, F, ville, rue, numero, etage, cp, date);
    // On crée l'adresse du patient avec ses données
    const adr: Adresse = {
      ville: ville,
      codePostal: Number(cp),
      rue: rue,
      numero: numero,
      etage: etage === 'undefined' ? '' : etage
    };
    // On crée le patient avec ses données
    const patient: PatientInterface = {
      prenom: prenom,
      nom: nom,
      sexe: (M) ? sexeEnum.M : sexeEnum.F,
      numeroSecuriteSociale: nss,
      adresse: adr,
    };
    // On ajoute le patient aux patients non affectés
    this.cabinetService.patientsNonAffectes.push(patient);
  }
  getNurses() {
    return this.cabinetService.infirmiers;
  }
  getPatients() {
    return this.cabinet.getPatients();
  }
  getNomCabinet() {
    return this.cabinet.getNomCabinet;
  }
  cacher(patient) {
    let lu = true;
    // On parcourt les patients non affectés
    this.cabinetService.patientsNonAffectes.forEach(pat => {
      // Si le patient fait partie des patients non affectés
      if (pat.numeroSecuriteSociale === patient.numeroSecuriteSociale) {
        lu = false;
      }
    });
    return lu;
  }

  ngOnInit() {
  }
}

