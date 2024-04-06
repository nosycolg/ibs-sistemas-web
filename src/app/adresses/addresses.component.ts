import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
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
    addresess: Addresses[] = [];
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
            console.error("Error fetching people data:", error);
        }
    }

    async editAddress(address: Addresses) {
        await this.apiService.editAddress(address);
        this.successToast("ADDRESS_UPDATED");
        this.closeModal();
        return await this.getAddresses(this.pagination.page);
    }

    async deleteAddress(id: number) {
        try {
            await this.apiService.deleteAddress(id);
            this.successToast("ADDRESS_DELETED");
            this.closeModal();
            return await this.getAddresses(this.pagination.page);
        } catch (error) {
            console.error("Error fetching people data:", error);
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
        this.getAddresses(this.pagination.page);
    }

    formatTime(date?: Date) {
        return moment(date).format("HH:mm:ss A");
    }

    formatDate(date?: Date) {
        return moment(date).format("YYYY-MM-DD");
    }
}
