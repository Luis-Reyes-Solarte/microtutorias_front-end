import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-form',
  imports: [
    RouterLink,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm implements OnInit {
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  isEdit = false;
  model: Partial<User> = {
    username: '',
    email: '',
    password: '',
    is_tutor: false,
    is_student: true,
  };

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.userService.get(id).subscribe((data) => {
        this.model = { ...data, password: '' };
      });
    }
  }

  save() {
    if (this.isEdit) {
      const payload = { ...this.model };
      if (!payload.password) delete payload.password;
      this.userService.update(this.model.id!, payload).subscribe(() => {
        this.router.navigate(['/app/users']);
      });
    } else {
      this.userService.create(this.model).subscribe(() => {
        this.router.navigate(['/app/users']);
      });
    }
  }
}
