import { Component, Output, EventEmitter, Input } from '@angular/core';
import {
    ApiService,
    SelectedPersonService,
    People,
    SelectedAdressService,
    Addresses
} from '../../services/app-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-login-modal',
    templateUrl: './views/login-modal.component.html',
    styleUrls: ['../app.component.css']
})
export class LoginModalComponent {
    @Output() closeModal = new EventEmitter<void>();
    @Output() login = new EventEmitter<{
        username: string;
        password: string;
    }>();

    username: string = '';
    password: string = '';

    handleCloseModal() {
        this.closeModal.emit();
    }

    handleLogin() {
        this.login.emit({ username: 'nosycolg', password: 'Cristhian08!' });
    }
}

@Component({
    selector: 'app-register-modal',
    templateUrl: './views/register-modal.component.html',
    styleUrls: ['../app.component.css']
})
export class RegisterModalComponent {
    @Output() closeModal = new EventEmitter<void>();
    @Output() register = new EventEmitter<{
        username: string;
        password: string;
    }>();

    username: string = '';
    password: string = '';

    handleCloseModal() {
        this.closeModal.emit();
    }

    handleRegister() {
        this.register.emit({ username: 'nosycolg2', password: 'Cristhian08!' });
    }
}

@Component({
    selector: 'app-create-and-edit-person-modal',
    templateUrl: './views/create-and-edit-person-modal.component.html',
    styleUrls: ['../app.component.css']
})
export class CreateAndEditPersonModalComponent {
    @Output() closeModal = new EventEmitter<void>();
    @Output() createPerson = new EventEmitter<People>();
    @Output() editPerson = new EventEmitter<People>();
    person: People | null = null;

    constructor(private selectedPersonService: SelectedPersonService) {}

    ngOnInit() {
        this.selectedPersonService.getSelectedPerson().subscribe(person => {
            this.person = person;
        });
    }

    handleCloseModal() {
        this.closeModal.emit();
    }

    handleCreatePerson() {
        if (!this.person) return;
        this.createPerson.emit(this.person);
    }

    handleEditPerson() {
        this.editPerson.emit(this.person!);
    }
}

@Component({
    selector: 'app-insert-and-edit-address-modal',
    templateUrl: './views/insert-and-edit-address-modal.component.html',
    styleUrls: ['../app.component.css']
})
export class InsertAndEditAddressModalComponent {
    @Output() closeModal = new EventEmitter<void>();
    @Output() insertAddress = new EventEmitter<Addresses>();
    @Output() editAddress = new EventEmitter<Addresses>();
    @Input() selectedPersonName = '';
    address: Addresses | null = null;

    constructor(
        private toastr: ToastrService,
        private apiService: ApiService,
        private selectedAddressService: SelectedAdressService
    ) {}

    ngOnInit() {
      this.selectedAddressService.getSelectedAddress().subscribe(address => {
          this.address = address;
      });
  }

    async searchCep() {
        if (!this.address!.cep) {
            return;
        }
        const complete = await this.apiService.searchCep(this.address!.cep);
        if (complete) {
            this.address!.street = complete.logradouro;
            this.address!.district = complete.bairro;
            this.address!.city = complete.localidade;
            this.address!.state = complete.uf;
            this.address!.country = 'Brasil';
        }

        this.toastr.success('Cep loaded!');
    }

    handleInsertAddress() {
      if (!this.address) return;
        this.insertAddress.emit(this.address);
    }

    handleEditAddress() {
      if (!this.address) return;
        this.editAddress.emit(this.address);
    }

    handleCloseModal() {
        this.closeModal.emit();
    }
}

@Component({
    selector: 'app-confirmate-modal',
    templateUrl: './views/confirmate-modal.component.html',
    styleUrls: ['../app.component.css']
})
export class ConfirmateModalComponent {
    @Output() closeModal = new EventEmitter<void>();
    @Output() confirmModal = new EventEmitter<void>();
    @Input() confirmateTitleModal: string = '';

    handleCloseModal() {
        this.closeModal.emit();
    }

    handleConfirm() {
        this.confirmModal.emit();
    }
}
