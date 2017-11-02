import 'core/styles.scss';

import { BaseClientRun } from 'core/utils/baseClientRun';
import { MainPage } from './components/MainPage/MainPage';

const runner = new BaseClientRun();

runner.run(MainPage);
