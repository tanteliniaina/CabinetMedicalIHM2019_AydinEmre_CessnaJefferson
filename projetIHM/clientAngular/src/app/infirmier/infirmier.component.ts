/*Autors : Emre Aydin Et Cessna Jefferson*/
import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {InfirmierInterface} from '../dataInterfaces/infirmier';
import {CabinetMedicalService} from '../cabinet-medical.service';
import {CabinetInterface} from '../dataInterfaces/cabinet';
import {PatientInterface} from '../dataInterfaces/patient';
@Component({
  selector: 'app-infirmier',
  templateUrl: './infirmier.component.html',
  styleUrls: ['./infirmier.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InfirmierComponent implements OnInit  {
  @Input() infirmier: InfirmierInterface;
  @Input() cabinet: CabinetInterface;

  protected  cabinetMedical: CabinetMedicalService;

  constructor(cabinetService: CabinetMedicalService) {
    console.log('Infirmier');
    this.cabinetMedical = cabinetService;
  }
  affectPatientDragDrop(id: string, event: PatientInterface) {
    let patient: PatientInterface;
    let i = 0;
    // On appelle la méthode du cabinet pour lancer un requête d'affectation/désaffectation
    this.cabinetMedical.postAffect(id, event.numeroSecuriteSociale);
    // On parcourt les patients non affectés
    this.cabinet.patientsNonAffectes.forEach(pat => {
      // Si le patient fait partie des patients non affectés
      if (pat.numeroSecuriteSociale === event.numeroSecuriteSociale) {
        patient = pat;
        // On le supprime des patients non affectés
        this.cabinet.patientsNonAffectes.splice(i, 1);
      }
      i++;
    });
    // On parcourt les infirmières
    this.cabinet.infirmiers.forEach(inf => {
      i = 0;
      // Pour chaque infirmière on parcourt ses patients
      inf.patients.forEach(pat => {
        // Si le patient est affecté à l'infirmières
        if (pat.numeroSecuriteSociale === event.numeroSecuriteSociale) {
          // On le supprime
          inf.patients.splice(i, 1);
          patient = pat;
        }
        i++;
      });
    });
    // On parcourt les infirmières
    this.cabinet.infirmiers.forEach(inf => {
      // Si on est sur l'infirmière choisie
      if (inf.id === id) {
        // On ajoute le patient à l'infirmière
        inf.patients.push(patient);
      }
    });
  }
  countPatient(infirmier: InfirmierInterface): number {
    let total = 0;
    // On parcourt les patients pour les compter
    this.infirmier.patients.forEach(pat => total += 1);
    return total;
  }

  ngOnInit() {
  }

}

