import { Route } from '@angular/router';
import { TasksComponent } from './tasks/tasks.component';
import { TestComponent } from './test/test.component';
import { IdleComponent } from './modules/idle/idle.component';

export const appRoutes: Route[] = [
  { path: 'tasks', component: TasksComponent },
  { path: 'test', component: TestComponent },
  { path: 'idle', component: IdleComponent },
];
