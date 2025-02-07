import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesSeconds'
})
export class MinutesSecondsPipe implements PipeTransform {

  transform(value: number): string {
    if (isNaN(value) || value < 0) {
      return '0M 00S'; // Default for invalid values
    }

    const totalSeconds = Math.floor(value / 1000); // Convert milliseconds to seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  }
}