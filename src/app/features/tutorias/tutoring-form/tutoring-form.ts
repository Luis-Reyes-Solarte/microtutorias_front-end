import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { TutoringService } from '../../../core/services/tutoring.service';
import { SubjectService } from '../../../core/services/subject.service';
import { TutoringAd } from '../../../core/models/tutoring.model';
import { Subject } from '../../../core/models/subject.model';

@Component({
  selector: 'app-tutoring-form',
  imports: [
    RouterLink,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './tutoring-form.html',
  styleUrl: './tutoring-form.css',
})
export class TutoringForm implements OnInit {
  private readonly tutoringService = inject(TutoringService);
  private readonly subjectService = inject(SubjectService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  isEdit = false;
  subjects: Subject[] = [];
  model: Partial<TutoringAd> = {
    subject: undefined,
    description: '',
    price_per_hour: '',
    available_date: '',
  };

  ngOnInit() {
    this.subjectService.list().subscribe((data) => (this.subjects = data));
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.tutoringService.get(id).subscribe((data) => (this.model = data));
    }
  }

  save() {
    const obs = this.isEdit
      ? this.tutoringService.update(this.model.id!, this.model)
      : this.tutoringService.create(this.model);

    obs.subscribe(() => this.router.navigate(['/my-tutorias']));
  }
}
