import { Component, ElementRef, Renderer2 } from "@angular/core";
import moment from "moment";
import { ToastrService } from "ngx-toastr";
import {
    Addresses,
    ApiService,
    PagesData,
    People,
    UserData,
} from "../../services/app-api.service";
import { TranslateService } from "@ngx-translate/core";
import confetti from "canvas-confetti";
import { Router } from "@angular/router";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.css",
})
export class HomeComponent {
    showLoginModal: boolean = false;
    showCreatePeopleModal: boolean = false;
    showinsertAddressModal: boolean = false;
    showRegisterModal: boolean = false;
    showConfirmateModal: boolean = false;
    showEditPeopleModal: boolean = false;
    USER_NAME: string | null = "";
    BEARER_TOKEN: string | null = "";
    selectedPersonName: string = "";
    selectedPerson: People | null = null;
    pagination: PagesData = {
        page: 1,
        pages: 0,
        results: [],
    };
    search: string = "";
    category: string = "name";

    constructor(
        private toastr: ToastrService,
        private apiService: ApiService,
        private translate: TranslateService,
        private renderer2: Renderer2,
        private elementRef: ElementRef,
    ) {}

    async ngOnInit() {
        this.getPeople(this.pagination.page);
        this.USER_NAME = localStorage.getItem("USER_NAME");
        this.BEARER_TOKEN = localStorage.getItem("BEARER_TOKEN")
    }

    async login(data: UserData) {
        try {
            if (!data.username) {
                return this.errorToast("USERNAME_REQUIRED");
            }

            if (!data.password) {
                return this.errorToast("PASSWORD_REQUIRED");
            }

            const loginData = await this.apiService.login(data);
            const { token, username } = loginData;

            if (token) {
                localStorage.setItem("BEARER_TOKEN", token);
                localStorage.setItem("USER_NAME", username);
            }

            this.ngOnInit();
            this.closeModal();
            this.successToast("LOGIN_SUCCESSFUL");
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return this.errorToast(error.message);
            }
        }
    }

    async register(data: UserData) {
        try {
            const { username, password, repeatedPassword } = data;

            if (!username) {
                return this.errorToast("USERNAME_REQUIRED");
            }

            if (!password) {
                return this.errorToast("PASSWORD_REQUIRED");
            }

            if (!repeatedPassword) {
                return this.errorToast("REPEATED_PASSWORD_REQUIRED");
            }

            if (password != repeatedPassword) {
                return this.errorToast("PASSWORDS_DO_NOT_MATCH");
            }

            await this.apiService.register(data);
            this.successToast("REGISTERED_SUCCESS");
            this.closeModal();
            return this.openLoginModal();
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return this.errorToast(error.message);
            }
        }
    }

    async logout() {
        this.removeItemsLocalStorage();
    }

    async getPeople(page: number, category?: string, search?: string) {
        try {
            const people = await this.apiService.getPeople(
                page,
                category,
                search,
            );
            this.pagination = {
                page: page,
                pages: people.pages,
                results: people.results,
            };
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return this.errorToast(error.message);
            }
        }
    }

    async createPerson(data: People) {
        try {
            const today = moment();
            const { name, gender, dateOfBirth, maritalStatus } = data;
            const birthDate = moment(dateOfBirth);

            if (!name) {
                return this.errorToast("NAME_REQUIRED");
            }

            if (!gender) {
                return this.errorToast("GENDER_REQUIRED");
            }

            if (dateOfBirth.length == 0) {
                return this.errorToast("BIRTHDAY_REQUIRED");
            }

            if (!maritalStatus) {
                return this.errorToast("MARITAL_STATUS_REQUIRED");
            }

            data.dateOfBirth = moment(data.dateOfBirth).format("DD-MM-YYYY");

            await this.apiService.createPerson(data);

            if (
                today.month() === birthDate.month() &&
                today.date() === birthDate.date()
            ) {
                this.successToast("WISH_CONGRATULATIONS");
                this.particles();
            }

            this.closeModal();
            this.successToast("CREATED_PERSON_SUCCESS");
            this.getPeople(this.pagination.page, this.category, this.search);
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return this.errorToast(error.message);
            }
        }
    }

    async editPerson(data: People) {
        try {
            const { name, gender, dateOfBirth, maritalStatus } = data;

            if (!name) {
                return this.errorToast("NAME_REQUIRED");
            }

            if (!gender) {
                return this.errorToast("GENDER_REQUIRED");
            }

            if (dateOfBirth.length == 0) {
                return this.errorToast("BIRTHDAY_REQUIRED");
            }

            if (!maritalStatus) {
                return this.errorToast("MARITAL_STATUS_REQUIRED");
            }

            data.dateOfBirth = moment(data.dateOfBirth).format("DD-MM-YYYY");

            await this.apiService.editPerson(data);
            this.closeModal();
            this.getPeople(this.pagination.page, this.category, this.search);
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return this.errorToast(error.message);
            }
        }
    }

    async deletePerson(people: People) {
        try {
            await this.apiService.deletePerson(people.id);
            this.closeModal();
            this.successToast("PERSON_DELETED_SUCCESSFULLY", {
                peopleName: this.selectedPerson?.name,
            });
            return await this.getPeople(
                this.pagination.page,
                this.category,
                this.search,
            );
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return this.errorToast(error.message);
            }
        }
    }

    async insertAddress(data: Addresses) {
        try {
            const {
                cep,
                street,
                streetNumber,
                district,
                city,
                state,
                country,
            } = data;

            if (!cep) {
                return this.errorToast("CEP_REQUIRED");
            }

            if (!street) {
                return this.errorToast("STREET_REQUIRED");
            }

            if (!streetNumber) {
                return this.errorToast("STREET_NUMBER_REQUIRED");
            }

            if (!district) {
                return this.errorToast("DISTRICT_REQUIRED");
            }

            if (!city) {
                return this.errorToast("CITY_REQUIRED");
            }

            if (!state) {
                return this.errorToast("STATE_REQUIRED");
            }

            if (!country) {
                return this.errorToast("COUNTRY_REQUIRED");
            }

            await this.apiService.insertAddress(data, this.selectedPerson!.id);
            this.closeModal();
            this.successToast("CREATED_ADDRESS_SUCCESS");
            return await this.getPeople(
                this.pagination.page,
                this.category,
                this.search,
            );
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return this.errorToast(error.message);
            }
        }
    }

    removeItemsLocalStorage() {
        localStorage.removeItem("USER_NAME");
        localStorage.removeItem("BEARER_TOKEN");
        window.location.reload();
    }

    particles(): void {
        const canvas = this.renderer2.createElement("canvas");

        this.renderer2.appendChild(this.elementRef.nativeElement, canvas);

        const myConfetti = confetti.create(canvas, {
            resize: true,
        });

        myConfetti({
            particleCount: 500,
            startVelocity: 70,
            spread: 360,
            gravity: 1,
            drift: 2,
            ticks: 200,
        });
    }

    openLoginModal() {
        this.showLoginModal = true;
    }

    openRegisterModal() {
        this.showRegisterModal = true;
    }

    openInsertAddressModal(personName: string, person: People) {
        this.selectedPersonName = personName;
        this.selectedPerson = person;
        this.showinsertAddressModal = true;
    }

    confirmModal() {
        if (!this.selectedPerson) return;
        this.deletePerson(this.selectedPerson);
    }

    closeModal() {
        this.showLoginModal = false;
        this.showCreatePeopleModal = false;
        this.showRegisterModal = false;
        this.showinsertAddressModal = false;
        this.showConfirmateModal = false;
        this.showEditPeopleModal = false;
    }

    searchChange() {
        if (this.category == "gender") {
            this.search = "MALE";
            return this.getPeople(1, this.category, this.search);
        }
        if (this.category == "maritalStatus") {
            this.search = "SINGLE";
            return this.getPeople(1, this.category, this.search);
        }

        this.search = "";
        return this.getPeople(1);
    }

    errorToast(value: string, params?: Object) {
        this.toastr.error(this.translate.instant(value, params));
    }

    successToast(value: string, params?: Object) {
        this.toastr.success(this.translate.instant(value, params));
    }

    formatTime(date?: Date) {
        return moment(date).format("HH:mm:ss A");
    }

    formatDate(date?: Date) {
        return moment(date).format("YYYY-MM-DD");
    }

    sumNumbers(input: number, output: number) {
        return Number(input) + Number(output);
    }
}
