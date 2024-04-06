import { Component, Output, EventEmitter, Input } from "@angular/core";
import { ApiService, People, Addresses } from "../../services/app-api.service";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-login-modal",
    templateUrl: "./views/login-modal.component.html",
    styleUrls: ["../app.component.css"],
})
export class LoginModalComponent {
    @Output() closeModal = new EventEmitter<void>();
    @Output() login = new EventEmitter<{
        username: string;
        password: string;
    }>();

    username: string = "";
    password: string = "";

    handleCloseModal() {
        this.closeModal.emit();
    }

    handleLogin() {
        this.login.emit({ username: this.username, password: this.password });
    }
}

@Component({
    selector: "app-register-modal",
    templateUrl: "./views/register-modal.component.html",
    styleUrls: ["../app.component.css"],
})
export class RegisterModalComponent {
    @Output() closeModal = new EventEmitter<void>();
    @Output() register = new EventEmitter<{
        username: string;
        password: string;
    }>();

    username: string = "";
    password: string = "";
    repeatedPassword: string = "";

    handleCloseModal() {
        this.closeModal.emit();
    }

    handleRegister() {
        this.register.emit({
            username: this.username,
            password: this.password,
        });
    }
}

@Component({
    selector: "app-create-person-modal",
    templateUrl: "./views/create-person-modal.component.html",
    styleUrls: ["../app.component.css"],
})
export class CreatePersonModalComponent {
    @Output() closeModal = new EventEmitter<void>();
    @Output() createPerson = new EventEmitter<People>();
    person: People = {
        id: 0,
        name: "",
        gender: "",
        dateOfBirth: "",
        maritalStatus: "",
        addresses: [],
    };

    handleCloseModal() {
        this.closeModal.emit();
    }

    handleCreatePerson() {
        this.createPerson.emit(this.person);
    }
}

@Component({
    selector: "app-edit-person-modal",
    templateUrl: "./views/edit-person-modal.component.html",
    styleUrls: ["../app.component.css"],
})
export class EditPersonModalComponent {
    @Output() closeModal = new EventEmitter<void>();
    @Output() editPerson = new EventEmitter<People>();

    private _selectedPerson: People | null = null;

    @Input()
    set selectedPerson(value: People | null) {
        this._selectedPerson = value;
        if (value) {
            this.person = { ...value };
        }
    }
    get selectedPerson(): People | null {
        return this._selectedPerson;
    }

    person: People = {
        id: 0,
        name: "",
        gender: "",
        dateOfBirth: "",
        maritalStatus: "",
        addresses: [],
    };

    handleCloseModal() {
        this.closeModal.emit();
    }

    handleEditPerson() {
        if (this.person) {
            this.editPerson.emit(this.person);
        }
    }
}

@Component({
    selector: "app-insert-address-modal",
    templateUrl: "./views/insert-address-modal.component.html",
    styleUrls: ["../app.component.css"],
})
export class InsertAddressModalComponent {
    @Output() closeModal = new EventEmitter<void>();
    @Output() insertAddress = new EventEmitter<Addresses>();
    @Input() selectedPersonName = "";
    address: Addresses = {
        id: 0,
        cep: "",
        street: "",
        streetNumber: "",
        district: "",
        city: "",
        state: "",
        country: "",
        complement: "",
        person: {} as People,
    };

    constructor(
        private toastr: ToastrService,
        private apiService: ApiService,
    ) {}

    async searchCep() {
        if (!this.address.cep) {
            return;
        }
        const complete = await this.apiService.searchCep(this.address.cep);
        if (complete) {
            this.address!.street = complete.logradouro;
            this.address!.district = complete.bairro;
            this.address!.city = complete.localidade;
            this.address!.state = complete.uf;
            this.address!.country = "Brasil";
        }

        this.toastr.success("Cep loaded!");
    }

    handleInsertAddress() {
        this.insertAddress.emit(this.address);
    }

    handleCloseModal() {
        this.closeModal.emit();
    }
}

@Component({
    selector: "app-edit-address-modal",
    templateUrl: "./views/edit-address-modal.component.html",
    styleUrls: ["../app.component.css"],
})
export class EditAddressModalComponent {
    @Output() closeModal = new EventEmitter<void>();
    @Output() editAddress = new EventEmitter<Addresses>();

    private _selectedAddress: Addresses | null = null;

    @Input()
    set selectedAddress(value: Addresses | null) {
        this._selectedAddress = value;
        if (value) {
            this.address = { ...value };
        }
    }
    get selectedAddress(): Addresses | null {
        return this._selectedAddress;
    }

    address: Addresses = {
        id: 0,
        cep: "",
        street: "",
        streetNumber: "",
        district: "",
        city: "",
        state: "",
        country: "",
        complement: "",
        person: {} as People,
    };

    constructor(
        private toastr: ToastrService,
        private apiService: ApiService,
    ) {}

    async searchCep() {
        if (!this.address.cep) {
            return;
        }
        const complete = await this.apiService.searchCep(this.address.cep);
        if (complete) {
            this.address!.street = complete.logradouro;
            this.address!.district = complete.bairro;
            this.address!.city = complete.localidade;
            this.address!.state = complete.uf;
            this.address!.country = "Brasil";
        }

        this.toastr.success("Cep loaded!");
    }

    handleEditAddress() {
        this.editAddress.emit(this.address);
    }

    handleCloseModal() {
        this.closeModal.emit();
    }
}

@Component({
    selector: "app-confirmate-modal",
    templateUrl: "./views/confirmate-modal.component.html",
    styleUrls: ["../app.component.css"],
})
export class ConfirmateModalComponent {
    @Output() closeModal = new EventEmitter<void>();
    @Output() confirmModal = new EventEmitter<void>();
    @Input() confirmateTitleModal: string = "";

    handleCloseModal() {
        this.closeModal.emit();
    }

    handleConfirm() {
        this.confirmModal.emit();
    }
}
