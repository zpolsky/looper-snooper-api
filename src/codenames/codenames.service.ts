import { Injectable } from '@nestjs/common';
import { words } from 'src/global/constants';
import { shuffle } from 'src/global/utils';

enum CellType {
  Red = 'RED',
  Blue = 'BLUE',
  Bomb = 'BOMB',
  None = 'NONE',
}

interface Cell {
  word: string;
  team: CellType;
  isRevealed: boolean;
}

@Injectable()
export class CodenamesService {
  private chooseElements(numElements: number): string[] {
    const chosenElements = new Set<string>();
    const elements: string[] = [];
    while (chosenElements.size < numElements) {
      const randomElement = words[Math.floor(Math.random() * words.length)];
      if (!chosenElements.has(randomElement)) {
        elements.push(randomElement);
        chosenElements.add(randomElement);
      }
    }
    return elements;
  }
  private createCellTypes(words: string[]): Cell[] {
    let redTiles, blueTiles;
    // FIXME: scale number of tiles by words.length
    if (Math.random() < 0.5) {
      redTiles = 9;
      blueTiles = 8;
    } else {
      redTiles = 8;
      blueTiles = 9;
    }
    let bombTiles = 1;
    return words.map(
      (word): Cell => {
        let type: CellType;
        if (redTiles > 0) {
          type = CellType.Red;
          redTiles--;
        } else if (blueTiles > 0) {
          type = CellType.Blue;
          blueTiles--;
        } else if (bombTiles > 0) {
          type = CellType.Bomb;
          bombTiles--;
        } else {
          type = CellType.None;
        }
        return {
          word: word.toUpperCase(),
          team: type,
          isRevealed: false,
        };
      },
    );
  }
  createBoard(boardSize = 5): Cell[][] {
    const elements = this.chooseElements(Math.pow(boardSize, 2));
    const cells = this.createCellTypes(elements);
    shuffle(cells);
    const board: Cell[][] = [];
    let row: Cell[] = [];
    for (const [index, cell] of cells.entries()) {
      if (index % boardSize === 0 && index !== 0) {
        board.push(row);
        row = [];
      }
      row.push(cell);
    }
    return board;
  }
}
