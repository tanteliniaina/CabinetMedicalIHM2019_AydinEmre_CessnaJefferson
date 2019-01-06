/*Autors : Emre Aydin Et Cessna Jefferson*/
import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {PatientInterface} from '../dataInterfaces/patient';
import {Http} from '@angular/http';
import {CabinetMedicalService} from '../cabinet-medical.service';
import {CabinetInterface} from '../dataInterfaces/cabinet';
import {Adresse} from '../dataInterfaces/adresse';
import {sexeEnum} from '../dataInterfaces/sexe';
@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PatientComponent implements OnInit {

  @Input() patient: PatientInterface;
  @Input() cabinetPatient: CabinetInterface;

  protected  cabinetMedical: CabinetMedicalService;
  public info = false;
  constructor(cabinetService: CabinetMedicalService, private http: Http) {
    console.log('Patient');
    this.cabinetMedical = cabinetService;
  }
  desaffectPatientBouton(prenom: string, nom: string, sexe: sexeEnum, ss: string, adresse: Adresse) {
    // On appelle la méthode du cabinet pour lancer un requête de désaffectation
    this.cabinetMedical.postAffect('none', ss);
    // Desaffectation
    let patient: PatientInterface;
    let i = 0;
    // On parcourt les infirmières
    this.cabinetPatient.infirmiers.forEach(inf => {
      if (i !== 0) { i = 0; }
      // Pour chaque infirmière on parcourt ses patients
      inf.patients.forEach(pat => {
        // Si le patient est affécté à l'infirmière
        if (pat.numeroSecuriteSociale === ss) {
          // On le supprime l'affectation
          inf.patients.splice(i, 1);
          patient = pat;
          // On rajoute le patient aux patients non affectés
          this.cabinetPatient.patientsNonAffectes.push(patient);
        }
        i++;
      });
    });
  }
  cacher(patient) {
    let lu = true;
    // On parcourt les patients non affectés
    this.cabinetPatient.patientsNonAffectes.forEach(pat => {
      // Si le patient fait partie des patients non affectés
      if (pat.numeroSecuriteSociale === patient.numeroSecuriteSociale) {
        lu = false;
      }
    });
    return lu;
  }
  sexePatient(sexe: sexeEnum): string {
    let sexeString: string;
    // Si c'est sexeEnum M on renvoie M sinon on renvoie F
    sexe === sexeEnum.M ? sexeString = 'M' : sexeString = 'F';
    return sexeString;
  }
  etagePatient(etage: string): string {
    let etageString: string;
    // Si c'est sexeEnum M on renvoie M sinon on renvoie F
    etage === '' ? etageString = '' : etageString = ', etage ' + etage;
    return etageString;
  }
  get_info() {
    return this.info;
  }

  set_info() {
    this.info = !this.info;
  }

  ngOnInit() {
  }

}

