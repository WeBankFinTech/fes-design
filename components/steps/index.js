import { withInstall, withNoopInstall } from '../_util/withInstall';
import Steps from './steps';
import Step from './step';

export const FSteps = withInstall(Steps, { Step });
export const FStep = withNoopInstall(Step);

export default FSteps;
