import { Routes } from '@angular/router';
import { MovieListComponent } from './movie-list/movie-list.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { AuthGuard } from './auth.guard';
import { VideoUploadComponent } from './video-upload/video-upload.component';

export const routes: Routes = [
    { path: '', component: MovieListComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegistrationComponent },
    {
        path: 'upload',
        component: VideoUploadComponent,
        canActivate: [AuthGuard]  // Protect the route
    },
    { path: 'movie/:id', component: MovieDetailComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '', pathMatch: 'full' }  // Wildcard route to redirect undefined paths
];
