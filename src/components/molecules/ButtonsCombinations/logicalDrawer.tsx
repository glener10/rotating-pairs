import { ICombination } from '@/interfaces/ICombination';
import { ISprint } from '@/interfaces/ISprint';
import {
  checkIfArrayIsOdd,
  returnNumberOfCombinationPerSprintRoundeddown,
  returnNumberOfSprints,
} from '@/utils/functions';

export const generateCombinations = (inputNamesInArray: string[]): ISprint[] => {
  //console.log('Create structure of the combination...\n');
  const numberOfNamesIsOdd = checkIfArrayIsOdd(inputNamesInArray);
  const numberOfSprint = returnNumberOfSprints(numberOfNamesIsOdd, inputNamesInArray);
  const numberOfCombinationPerSprint = returnNumberOfCombinationPerSprintRoundeddown(
    numberOfNamesIsOdd,
    inputNamesInArray
  );

  const allInputsValues: string[] = copyInputNamesInArray(inputNamesInArray);

  const sizeOfLoop =
    allInputsValues.length == 2 ? numberOfCombinationPerSprint : numberOfCombinationPerSprint - 1;

  let lastInputValue: string | null | undefined = null;

  if (!numberOfNamesIsOdd && allInputsValues.length > 2) {
    //console.log('Removing the last element, our logic only works with odd inputs. So at the end, just put the last value (which makes an entry even) in the place of the element that is alone, avoiding an additional combination in the check.\n');
    lastInputValue = allInputsValues.pop();
  }

  const combinations: ISprint[] = constructEmptySprintsCombinations(
    numberOfSprint,
    numberOfCombinationPerSprint,
    allInputsValues
  );

  const allCombinationsPossible = generateAllCombinationsPossible(inputNamesInArray);

  searchCombinations(combinations, sizeOfLoop, allCombinationsPossible);

  if (lastInputValue != null && lastInputValue) {
    //console.log('If the entry was even and greater than 2 elements, it means that we removed its last element and now it is necessary to attach it again to the one that is alone in each sprint combination.\n');
    combinations.map((combination: ISprint) => {
      combination.combinations[numberOfCombinationPerSprint - 1].pairTwo = lastInputValue as string;
    });
  }

  return combinations;
};

const searchCombinations = (
  combinations: ISprint[],
  sizeOfLoop: number,
  allCombinationsPossible: ICombination[]
): void => {
  //console.log('Searching combinations...\n');
  let maxTry = 0;
  combinations.map((combination) => {
    let maxTryChangingResorting = 0;
    let changingSorting = false;

    for (let indexA = 0; indexA < sizeOfLoop; indexA++) {
      if (maxTry == 10000) {
        throw 'Max try of ressorting exceded (1.000).';
      }
      let fix = false;
      let indexAllCombinationsPossible = 0;

      while (fix == false && indexAllCombinationsPossible < allCombinationsPossible.length) {
        const combinationOfAllCombinationsPossible =
          allCombinationsPossible[indexAllCombinationsPossible];
        if (
          !checkIfAnyEntriesExistingInACurrentSprintCombination(
            combinationOfAllCombinationsPossible?.pairOne,
            combinationOfAllCombinationsPossible?.pairTwo,
            combination.combinations
          )
        ) {
          combination.combinations[indexA].pairOne = combinationOfAllCombinationsPossible?.pairOne;
          combination.combinations[indexA].pairTwo = combinationOfAllCombinationsPossible?.pairTwo;
          allCombinationsPossible.splice(indexAllCombinationsPossible, 1);
          fix = true;
        }
        indexAllCombinationsPossible += 1;
      }

      if (fix == false) {
        maxTryChangingResorting += 1;
        if (maxTryChangingResorting >= 30000) {
          maxTry += 1;
          changingSorting = true;
          console.log('Ressorting...\n');
        }
        reSortingCombinationsOfTheSprint(
          combination,
          sizeOfLoop,
          allCombinationsPossible,
          changingSorting
        );
        indexA = -1;
      }
    }
  });
};

const reSortingCombinationsOfTheSprint = (
  combination: ISprint,
  sizeOfLoop: number,
  allCombinationsPossible: ICombination[],
  changingSorting: boolean
): void => {
  const lastCombination = combination.combinations.pop();
  combination.combinations.sort(() => Math.random() - 0.5);
  if (lastCombination) {
    combination.combinations.push(lastCombination);
  }
  if (changingSorting) {
    allCombinationsPossible.sort(() => Math.random() - 0.5);
  }
  for (
    let indexCleanCombinations = 0;
    indexCleanCombinations < sizeOfLoop;
    indexCleanCombinations++
  ) {
    if (
      combination.combinations[indexCleanCombinations].pairOne != '' &&
      combination.combinations[indexCleanCombinations].pairTwo != ''
    ) {
      allCombinationsPossible.push({
        pairOne: combination.combinations[indexCleanCombinations].pairOne,
        pairTwo: combination.combinations[indexCleanCombinations].pairTwo,
      });
      combination.combinations[indexCleanCombinations].pairOne = '';
      combination.combinations[indexCleanCombinations].pairTwo = '';
    }
  }
};

const generateAllCombinationsPossible = (inputNamesInArray: string[]): ICombination[] => {
  const allCombinationsPossible: ICombination[] = [];

  const numberOfNamesIsOdd = checkIfArrayIsOdd(inputNamesInArray);

  const allInputsValues = copyInputNamesInArray(inputNamesInArray);

  if (!numberOfNamesIsOdd && allInputsValues.length > 2) {
    allInputsValues.pop();
  }

  allInputsValues.map((inputInArrayA, indexA) => {
    allInputsValues.map((inputInArrayB, indexB) => {
      if (indexA != indexB) {
        allCombinationsPossible.push({ pairOne: inputInArrayA, pairTwo: inputInArrayB });
      }
    });
  });

  allCombinationsPossible.map((combinationA, indexA) => {
    allCombinationsPossible.map((combinationB, indexB) => {
      if (
        indexA != indexB &&
        (combinationA.pairOne == combinationB.pairOne ||
          combinationA.pairOne == combinationB.pairTwo) &&
        (combinationA.pairTwo == combinationB.pairOne ||
          combinationA.pairTwo == combinationB.pairTwo)
      ) {
        allCombinationsPossible.splice(indexB, 1);
      }
    });
  });
  return allCombinationsPossible;
};

function checkIfAnyEntriesExistingInACurrentSprintCombination(
  pairOne: string,
  pairTwo: string,
  combinations: ICombination[]
): boolean {
  let entriesExistingInACombination = false;
  combinations.map((comb) => {
    if (
      comb.pairOne == pairOne ||
      comb.pairOne == pairTwo ||
      comb.pairTwo == pairOne ||
      comb.pairTwo == pairTwo
    ) {
      entriesExistingInACombination = true;
    }
  });
  return entriesExistingInACombination;
}

const copyInputNamesInArray = (inputNamesInArray: string[]): string[] => {
  const allInputsValues = inputNamesInArray.map((input) => {
    return input;
  });
  return allInputsValues;
};

const constructEmptySprintsCombinations = (
  numberOfSprint: number,
  numberOfCombinationPerSprint: number,
  allInputsValues: string[]
): ISprint[] => {
  const combinations: ISprint[] = [];

  for (let indexA = 0; indexA < Number(numberOfSprint); indexA++) {
    const comb: ICombination[] = [];
    for (let indexB = 0; indexB < Number(numberOfCombinationPerSprint); indexB++) {
      if (numberOfCombinationPerSprint > 1 && indexB == numberOfCombinationPerSprint - 1) {
        const lastCombination = allInputsValues.pop();
        if (lastCombination) {
          comb.push({ pairOne: lastCombination, pairTwo: lastCombination });
        }
      } else {
        comb.push({ pairOne: '', pairTwo: '' });
      }
    }
    combinations.push({ combinations: comb });
  }

  return combinations;
};