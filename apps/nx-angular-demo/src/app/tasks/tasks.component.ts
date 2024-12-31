import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
} from '@angular/core';
import {
  CdkDrag,
  CdkDropList,
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { LocalStorageService } from '../services/local-storage.service';

export interface Task {
  name: string;
  details: string;
}

export interface TaskList {
  tasks: Task[];
  doneTasks: Task[];
}

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CdkDrag,
    CdkDropList,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
})
export class TasksComponent implements OnInit {
  private localStorageService = inject(LocalStorageService);

  protected tasks: Task[] = [];
  protected doneTasks: Task[] = [];

  public ngOnInit(): void {
    this.tasks = JSON.parse(this.localStorageService.load('tasks')) || [];
    this.doneTasks =
      JSON.parse(this.localStorageService.load('doneTasks')) || [];

    if (this.tasks.length === 0 && this.doneTasks.length === 0) {
      // We need to at least initialize both tasks and doneTasks
      // to empty arrays so that the drag-and-drop functionality works.
      // Refactor to
      // this.tasks = this.localStorageService.load('tasks') || [];
      // this.doneTasks = this.localStorageService.load('doneTasks') || [];
      console.log('No tasks found in local storage. Loading defaults.');
      this.loadDefaultTasks();
    }
  }

  protected newTaskItem: Task = { name: '', details: '' };

  protected addTask(): void {
    this.tasks.unshift(this.newTaskItem);
    this.newTaskItem = { name: '', details: '' };
    this.save();
  }

  protected removeTask(task: Task): void {
    this.tasks.splice(this.tasks.indexOf(task), 1);
    this.save();
  }

  protected removeDoneTask(task: Task): void {
    this.doneTasks.splice(this.doneTasks.indexOf(task), 1);
    this.save();
  }

  protected dropTask(event: CdkDragDrop<Task[]>): void {
    console.log('dropTask', event);
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    this.save();
  }

  private loadDefaultTasks(): void {
    this.tasks = [
      {
        name: 'Get up',
        details: 'Get up and get ready for the day',
      },
      {
        name: 'Brush teeth',
        details: 'Brush your teeth',
      },
    ];

    this.doneTasks = [];
  }

  private save(): void {
    this.localStorageService.save('tasks', this.tasks);
    this.localStorageService.save('doneTasks', this.doneTasks);
  }
}
