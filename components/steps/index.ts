import { withInstall, withNoopInstall } from '../_util/withInstall';
import Steps from './steps';
import Step from './step';

import type { SFCWithInstall } from '../_util/interface';

type StepsType = SFCWithInstall<typeof Steps>;
type StepType = SFCWithInstall<typeof Step>;

export const FSteps = withInstall<StepsType>(Steps as StepsType, { Step });
export const FStep = withNoopInstall<StepType>(Step as StepType);

export default FSteps;
