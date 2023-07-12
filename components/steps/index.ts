import { withInstall, withNoopInstall } from '../_util/withInstall';
import Steps from './steps';
import Step from './step';

import type { SFCWithInstall } from '../_util/interface';

type StepsType = SFCWithInstall<typeof Steps>;
type StepType = SFCWithInstall<typeof Step>;

export { stepsProps } from './steps';
export type { StepsProps } from './steps';
export const FSteps = withInstall<StepsType>(Steps as StepsType, { Step });

export { stepProps } from './step';
export type { StepProps } from './step';
export const FStep = withNoopInstall<StepType>(Step as StepType);

export default FSteps;
