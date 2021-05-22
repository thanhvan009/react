import './common.css';
import Counter from './components/Counter/index';
import EmployeeManagement from './components/EmployeeManagment/index';
import Navbar from './components/Navbar/index';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { StyledMainContent } from './styled';

function App() {
  return (
    <ToastProvider
      autoDismiss
      autoDismissTimeout={1500}
      placement="top-right"
    >
      <div className="app">
        <Router>
          <div className="container center">
            <Navbar />
            <StyledMainContent>
              <Switch>
                <Route exact path="/">
                  <Counter />
                </Route>
                <Route path="/employee-management">
                  <EmployeeManagement />
                </Route>
              </Switch>
            </StyledMainContent>
          </div>
        </Router>
      </div>
    </ToastProvider>
  );
}

export default App;
