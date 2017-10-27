
import { BaseClientRun } from 'core/utils/baseClientRun';
import { MainPage } from './components/MainPage/MainPage';

const runner = new BaseClientRun({
  domainName: 'main',
  pageName:  'main'
});

runner.run(MainPage);
