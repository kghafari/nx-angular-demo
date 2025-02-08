import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { PianoRollV2Component } from '@nx-angular-demo/piano-roll';
import { MinutesSecondsPipe } from '@nx-angular-demo/pipes';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { map, throttleTime } from 'rxjs';
import { Resource, Resources, ResourceType } from '../idle/models/idle.interfaces';
import { GameStateService } from '../idle/services/game-state.service';

@Component({
  selector: 'app-tab',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    PianoRollV2Component,
    MinutesSecondsPipe,
    MatProgressBarModule,
  ],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent {
  private readonly gameService = inject(GameStateService);

  protected resources$ = this.gameService.resources$;
  protected elapsedTime$ = this.gameService.elapsedTime$;

  protected remainingTime$ = this.gameService.remainingTime$;

  protected normalizedResources$ = this.resources$.pipe(
    // only update every second
    throttleTime(1000),
    map((resources) => {
      return this.normalizeResources(resources);
    })
  );

  protected updateResourceMult(resource: Resource, value: number): void {
    console.log('updateResourceMult', resource, value);
    this.gameService.applyUpgrade(resource, value);
  }

  private normalizeResources(resources: Resource[]): Resource[]{
    //const maxVal = Math.max(...Object.values(resources));

    const maxVal = Math.max(...resources.map((r) => r.value));

    // avoid division by zero
    if (maxVal === 0) {
      return resources;
    }

    return resources.map((r) => {
      return {
        ...r,
        value: r.value / maxVal * 100,
      };
    });
  }

  trackByKey(index: number, item: { key: string; value: number }): string {
    return item.key;
  }
}
