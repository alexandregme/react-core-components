import 'core/styles.scss';

import { BaseClientRun } from 'core/utils/baseClientRun';
import { LandingPage } from './components/LandingPage/LandingPage';

const runner = new BaseClientRun();

runner.run(LandingPage);