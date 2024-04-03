import { Component, ElementRef, Renderer2 } from '@angular/core';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import {
  ApiService,
  PagesData,
  People,
  UserData,
} from '../../services/app-api.service';
import { TranslateService } from '@ngx-translate/core';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  showLoginModal: boolean = false;
  showCreatePeopleModal: boolean = false;
  showinsertAddressModal: boolean = false;
  showRegisterModal: boolean = false;
  showConfirmateModal: boolean = false;
  showEditPeopleModal: boolean = false;
  USER_NAME: string | null = '';
  selectedPersonName: string = '';
  selectedPerson: People | null = null;
  pagination: PagesData = {
    page: 0,
    pages: 0,
    data: [],
  };

  constructor(
    private toastr: ToastrService,
    private apiService: ApiService,
    private translate: TranslateService,
    private renderer2: Renderer2,
    private elementRef: ElementRef,
  ) {}

  async ngOnInit() {
    this.getPeople(this.pagination.page);
    this.USER_NAME = localStorage.getItem('USER_NAME');
  }

  async login(data: UserData) {
    const loginData = await this.apiService.login(data);
    const { token, username } = loginData;

    if (token) {
      localStorage.setItem('BEARER_TOKEN', token);
      localStorage.setItem('USER_NAME', username);
    }

    this.ngOnInit();
    this.closeModal();
    this.successToast('LOGIN_SUCCESSFUL');
  }

  async register(data: UserData) {
    await this.apiService.register(data);
    this.successToast('REGISTERED_SUCCESS');
    this.closeModal();
    return this.openLoginModal();
  }

  async logout() {
    this.removeItemsLocalStorage();
  }

  async getPeople(page: number) {
    try {
      const people = await this.apiService.getPeople(page);
      this.pagination = {
        page: page,
        pages: people.pages,
        data: people.data,
      };
    } catch (error) {
      console.error('Error fetching people data:', error);
    }
  }

  async createPerson(data: People) {
    try {
      const today = new Date();
      const { name, gender, dateOfBirth, maritalStatus } = data;

      const birthDate = new Date(dateOfBirth);


      if (!name) {
        return this.errorToast('NAME_REQUIRED');
      }

      if (!gender) {
        return this.errorToast('GENDER_REQUIRED');
      }

      if (dateOfBirth.length == 0) {
        return this.errorToast('BIRTHDAY_REQUIRED');
      }

      if (!maritalStatus) {
        return this.errorToast('MARITAL_STATUS_REQUIRED');
      }

      await this.apiService.createPerson(data);

      const todayMonth = today.getMonth() + 1;
      const todayDay = today.getDate();
      const birthMonth = birthDate.getMonth() + 1;
      const birthDay = birthDate.getDate();

      if (birthMonth === todayMonth && birthDay === todayDay) {
        this.successToast('WISH_CONGRATULATIONS');
        this.particles()
      }

      this.closeModal();
      this.successToast('CREATED_PERSON_SUCCESS');
      this.getPeople(this.pagination.page);
    } catch (error) {
      console.error('Error fetching people data:', error);
    }
  }

  async editPerson(data: People) {
    try {
      await this.apiService.editPerson(data);
      this.closeModal();
      this.getPeople(this.pagination.page);
    } catch (error) {
      console.error('Error fetching people data:', error);
    }
  }

  async deletePerson(people: People) {
    await this.apiService.deletePerson(people.id);
    this.closeModal();
    this.successToast('SUCESS_DELETE', {
      peopleName: this.selectedPerson?.name,
    });
    return await this.getPeople(this.pagination.page);
  }

  async insertAddress(data: any) {
    await this.apiService.insertAddress(data, this.selectedPerson!.id);
    this.closeModal();
    this.successToast('CREATED_ADDRESS_SUCCESS');
    return await this.getPeople(this.pagination.page);
  }

  removeItemsLocalStorage() {
    localStorage.removeItem('USER_NAME');
    localStorage.removeItem('BEARER_TOKEN');
    window.location.reload();

    this.errorToast('REMOVED_TOKEN');
  }

  particles(): void {
    const canvas = this.renderer2.createElement('canvas');

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
  }

  errorToast(value: string, params?: Object) {
    this.toastr.error(this.translate.instant(value, params));
  }

  successToast(value: string, params?: Object) {
    this.toastr.success(this.translate.instant(value, params));
  }

  formatTime(date?: Date) {
    return moment(date).format('HH:mm:ss A');
  }

  formatDate(date?: Date) {
    return moment(date).format('YYYY-MM-DD');
  }

  sumNumbers(input: number, output: number) {
    return Number(input) + Number(output);
  }
}
