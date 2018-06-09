import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from '@auth/auth.service';
import { SnackService } from '@common/snack.service';
import { AppService } from '@common/app.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    public auth: AuthService,
    public snackService: SnackService,
    public afs: AngularFirestore,
    private title: Title,
    private router: Router,
    private appService: AppService
  ) { }

  ngOnInit() {
    this.title.setTitle('Registro en la tienda');
  }

  signUp(user) {
    this.appService.fireLoader();

    this.auth.signUp(user.email.value, user.password.value).then((value) => {
      // console.log(value.user);
      const userJson = value.user;
      this.snackService.launch('Registro correcto, iniciando sesión', 'Alta usuario', 5000);

      const data = {
        uid: userJson.uid,
        email: user.email.value,
        displayName: user.email.value,
        photoUrl: null,
        role: 'customer'
      };

      this.afs.collection('users').doc(userJson.uid).set(data)
        .then(() => {
          this.appService.stopLoader();
          this.auth.emailAndPassword(user.email, user.password).then(() => {
            this.router.navigate(['/shop']);
          });
        })
        .catch(error => {
          this.appService.stopLoader();
        });
    })
    .catch(err => {
      this.appService.stopLoader();
      console.log(err);
      this.snackService.launch('Error: ' + err.message, 'Alta usuario', 5000);
    });
  }
}