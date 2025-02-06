// import { Injectable } from '@angular/core';
// import { BehaviorSubject, take } from 'rxjs';

// import { GameStateService } from './game-state.service';
// import { Upgrade } from '../models/idle.interfaces';

// @Injectable({
//   providedIn: 'root'
// })
// export class UpgradeService {
//   private upgrades: Upgrade[] = [
//     { id: 'prod1', name: 'Boost Production', resource: 'production', multiplier: 1.5, cost: 10, purchased: false },
//     { id: 'sci1', name: 'Boost Science', resource: 'science', multiplier: 1.5, cost: 15, purchased: false },
//     { id: 'faith1', name: 'Boost Faith', resource: 'faith', multiplier: 2, cost: 8, purchased: false },
//   ];

//   private upgrades$ = new BehaviorSubject<Upgrade[]>(this.upgrades);

//   constructor(private gameStateService: GameStateService) {}

//   getAvailableUpgrades() {
//     return this.upgrades$.asObservable();
//   }

//   purchaseUpgrade(upgradeId: string) {
//     let upgrades = this.upgrades.map(upg => {
//       if (upg.id === upgradeId && !upg.purchased) {
//         let resources$ = this.gameStateService.resources$;
        
//         resources$.pipe(
//             take(1)
//             ).subscribe(resources => {
//             if (resources[upg.resource] >= upg.cost) {
//                 resources[upg.resource] -= upg.cost;
//                 this.gameStateService.setResources(resources);
//                 upg.purchased = true;
//                 this.gameStateService.applyUpgrade(upg.resource, upg.multiplier);
//             }
//             });
//         )

//         if (resources['production'] >= upg.cost) {
//           resources['production'] -= upg.cost;
//           this.gameStateService.setResources(resources);
//           upg.purchased = true;
//           this.gameStateService.applyUpgrade(upg.resource, upg.multiplier);
//         }
//       }
//       return upg;
//     });

//     this.upgrades$.next(upgrades);
//   }
// }