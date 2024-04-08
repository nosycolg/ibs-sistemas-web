import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import moment from "moment";
import {
    AddressesPagesData,
    Addresses,
    ApiService,
    People,
} from "../../services/app-api.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: "app-addresses",
    templateUrl: "./addresses.component.html",
    styleUrl: "../home/home.component.css",
})
export class AddressesComponent {
    USER_NAME: string | null = "";
    BEARER_TOKEN: string | null = "";
    showConfirmateModal: boolean = false;
    showEditModal: boolean = false;
    selectedAddress: Addresses = {
        id: 0,
        cep: "",
        street: "",
        streetNumber: "",
        district: "",
        city: "",
        state: "",
        country: "",
        complement: "",
        createdAt: undefined,
        updatedAt: undefined,
        person: {} as People,
    };
    pagination: AddressesPagesData = {
        page: 1,
        pages: 0,
        results: [],
    };
    search: string = "";
    category: string = "street";

    constructor(
        private route: ActivatedRoute,
        private apiService: ApiService,
        private toastr: ToastrService,
        private translate: TranslateService,
    ) {}

    async ngOnInit() {
        await this.getAddresses(this.pagination.page);
        this.BEARER_TOKEN = localStorage.getItem("BEARER_TOKEN");
        this.USER_NAME = localStorage.getItem("USER_NAME");
    }

    async getAddresses(page: number, category?: string, search?: string) {
        try {
            const id = Number(this.route.snapshot.paramMap.get("id"));
            const data = await this.apiService.getAddresses(
                id,
                page,
                category,
                search,
            );
            this.pagination = {
                page: page,
                pages: data.pages,
                results: data.results,
            };
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                return this.errorToast(error.message);
            }
        }
    }

    async editAddress(address: Addresses) {
        try {
            const {
                cep,
                street,
                streetNumber,
                district,
                city,
                state,
                country,
            } = address;

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

            await this.apiService.editAddress(address);
            this.successToast("ADDRESS_UPDATED_SUCCESSFULLY");
            this.closeModal();
            return await this.getAddresses(
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

    async deleteAddress(id: number) {
        try {
            await this.apiService.deleteAddress(id);
            this.successToast("ADDRESS_DELETED_SUCCESSFULLY");
            this.closeModal();
            return await this.getAddresses(
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

    errorToast(value: string, params?: Object) {
        this.toastr.error(this.translate.instant(value, params));
    }

    successToast(value: string, params?: Object) {
        this.toastr.success(this.translate.instant(value, params));
    }

    searchChange() {
        if (this.category == "state") {
            this.search = "AC";
            return this.getAddresses(1, this.category, this.search);
        }

        this.search = "";
        return this.getAddresses(1);
    }

    closeModal() {
        this.showConfirmateModal = false;
        this.showEditModal = false;
    }

    confirmModal() {
        this.deleteAddress(this.selectedAddress.id);
    }

    formatTime(date?: Date) {
        return moment(date).format("HH:mm:ss A");
    }

    formatDate(date?: Date) {
        return moment(date).format("DD-MM-YYYY");
    }
}
