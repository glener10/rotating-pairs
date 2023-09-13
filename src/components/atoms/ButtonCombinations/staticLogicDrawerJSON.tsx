/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { generateCombinations } from '@/components/atoms/ButtonCombinations/logicalDrawer';
import { ICombinationsJson } from '@/interfaces/ICombinationsJson';
import { ISprint } from '@/interfaces/ISprint';
import {
  checkIfArrayIsOdd,
  returnNumberOfCombinationPerSprintRoundeddown,
  returnNumberOfSprints,
} from '@/utils/functions';
import jsonCombinations from './combinations.json';

export const staticLogicReadCombinations = (inputNamesInArray: string[]): ISprint[] => {
  const numberOfInputs = inputNamesInArray.length;

  //@ts-ignore
  const readJsonCombinations: ICombinationsJson[] = jsonCombinations.jsonCombinations;
  const findElementWithEqualNumberOfInputs = readJsonCombinations.find(
    (combination) => combination.numberOfInputs == `${numberOfInputs}`
  );

  if (findElementWithEqualNumberOfInputs) {
    const sprintsOfElementWithEqualNumberOfInputs = findElementWithEqualNumberOfInputs.sprints;

    const shuffledInput = shuffleInput(inputNamesInArray);

    const combinationsConverted = convertCombinationsToInputNames(
      shuffledInput,
      sprintsOfElementWithEqualNumberOfInputs
    );

    return combinationsConverted;
  } else {
    const indexInputs = returnIndexOfInputs(inputNamesInArray); //For save in JSON a new mapping of combinations, we need the index and not the names
    const triedGenerateCombinations = generateCombinations(indexInputs);

    downloadJson(inputNamesInArray, triedGenerateCombinations);

    const shuffledInput = shuffleInput(inputNamesInArray);

    const combinationsConverted = convertCombinationsToInputNames(
      shuffledInput,
      triedGenerateCombinations
    );

    return combinationsConverted;
  }
};

const downloadJson = (inputNamesInArray: string[], triedGenerateCombinations: ISprint[]): void => {
  const numberOfNamesIsOdd = checkIfArrayIsOdd(inputNamesInArray);
  const numberOfSprint = returnNumberOfSprints(numberOfNamesIsOdd, inputNamesInArray);
  const numberOfCombinationPerSprint = returnNumberOfCombinationPerSprintRoundeddown(
    numberOfNamesIsOdd,
    inputNamesInArray
  );

  const newCombination = {
    numberOfInputs: inputNamesInArray.length,
    numberOfSprints: numberOfSprint,
    numberOfCombinationsPerSprint: numberOfCombinationPerSprint,
    sprints: triedGenerateCombinations,
  };
  const newValuesJson = jsonCombinations.jsonCombinations;
  newValuesJson.push(newCombination);
  const newObjectJson = JSON.stringify({ jsonCombinations: newValuesJson }, null, 2);

  const blob = new Blob([newObjectJson], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'combinations.json';

  const clickEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: false,
  });
  a.dispatchEvent(clickEvent);

  window.URL.revokeObjectURL(url);
};

const convertCombinationsToInputNames = (
  inputNamesInArray: string[],
  combinationsSprints: ISprint[]
): ISprint[] => {
  const convertedInput: ISprint[] = combinationsSprints.map((combination) => {
    return {
      combinations: combination.combinations.map((comb) => {
        return {
          pairOne: inputNamesInArray[Number(comb.pairOne)],
          pairTwo: inputNamesInArray[Number(comb.pairTwo)],
        };
      }),
    };
  });

  return convertedInput;
};

const shuffleInput = (inputNamesInArray: string[]): string[] => {
  const allInputsValues = inputNamesInArray.map((input) => {
    return input;
  });
  return allInputsValues.sort(() => Math.random() - 0.5);
};

const returnIndexOfInputs = (inputNamesInArray: string[]): string[] => {
  const allInputsValues = inputNamesInArray.map((input, index) => {
    input;
    return `${index}`;
  });
  return allInputsValues;
};