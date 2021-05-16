import React, {
  useState,
  useEffect
} from 'react';
import Modal from 'react-modal';
import * as _ from 'lodash';
import { useToasts } from 'react-toast-notifications'
import EmployeeTable from './EmployeeTable/index';
import EmployeeForm from './EmployeeForm/index';
import Spinner from '../Spinner/index';
import Title from '../Title/index';
import Button from '../Button/index';
import {
  StyledEmployeeManagement,
  StyledModal
} from './styled';
import {
  fetchListApi,
  getDetailApi,
  deleteItemApi,
  createItemApi,
  editItemApi,
} from '../../api/index';
import {
  initErrors,
  initFormData,
  errorsType,
  keysForm,
} from './constant';
import {
  CREATED_SUCCESS,
  EDITED_SUCCESS,
  DELETED_SUCCESS,
  ITEM_PER_PAGE,
  NOT_EMPTY,
  INCORRECT_EMAIL,
  NO_DATA_CHANGE,
} from '../../constant/index';
import {
  getTotalPages,
  isCorrectEmail
} from '../../helpers/index'

const EmployeeManagement = () => {
  const { addToast } = useToasts();

  const showErrorNotification = (text: string) =>
    addToast(text, {
      appearance: 'error',
      autoDismiss: true,
    });
  
  const showSuccessNotification = (text: string) =>
    addToast(text, {
      appearance: 'success',
      autoDismiss: true,
    });

  const [employeeList, setEmployeeList] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(1);
  const [formData, setFormData] = useState(initFormData);
  const [originDetailEmployee, setOriginDetailEmployee] = useState(initFormData);
  const [errors, setErrors] = useState(initErrors);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchEmployeeList = (page = 1) => {
    setLoading(true);
    fetchListApi(page < 1 ? 1 : page)
      .then(res => {
        const list = _.get(res, 'data.list', []);
        const total = _.get(res, 'data.total', 0);
        setCurrentPageIndex(page);
        setTotal(total);
        setEmployeeList(list);
        setLoading(false);
      })
      .catch((error) => {
        showErrorNotification(error.messageContent);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEmployeeList();
    // No need dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDetailEmployee = async (id:string) => {
    setIsOpen(true);
    setLoading(true);
    getDetailApi(id)
      .then(res => {
        setOriginDetailEmployee(res.data);
        setFormData(res.data);
        setLoading(false);
      })
      .catch((error) => {
        showErrorNotification(error.messageContent);
        setLoading(false);
      });
  };

  const deleteEmployee = async (id:string) => {
    setLoading(true);
    deleteItemApi(id)
      .then(res => {
        if (!_.isEmpty(res.data)) {
          showSuccessNotification(DELETED_SUCCESS);
          if (employeeList.length === 1) {
            fetchEmployeeList(currentPageIndex - 1);
          } else {
            fetchEmployeeList(currentPageIndex);
          }
          setLoading(false);
        }
      })
      .catch((error) => {
        showErrorNotification(error.messageContent);
        setLoading(false);
      });
  };

  const checkEmail = (value: string) => {
    if (value.trim() === '')
      setErrors({
        ...errors,
        email: NOT_EMPTY('email')
      });
    else {
      const isEmailCorrect = isCorrectEmail(value);
      setErrors({
        ...errors,
        email: isEmailCorrect ? '' : INCORRECT_EMAIL
      });
    }
  }

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'email') {
      checkEmail(value);
    } else {
      setErrors({
        ...errors,
        [name]: value.trim() ? '' : NOT_EMPTY(name)
      });
    }
  };

  const submitForm = () => {
    const id = _.get(formData, 'id', '');
    if (id) {
      if (_.isEqual(originDetailEmployee, formData)) {
        addToast(NO_DATA_CHANGE, {
          appearance: 'warning',
          autoDismiss: true,
        });
        return;
      }
    }

    let errorsTemp: errorsType = {};
    for (let key of keysForm) {
      if (key === 'email') {
        errorsTemp[key] =
          !formData[key].trim().length ?
          NOT_EMPTY(key) : !isCorrectEmail(formData[key]) ? 
          INCORRECT_EMAIL : '';
      } else {
        errorsTemp[key] = formData[key].length ? '' : NOT_EMPTY(key);
      }
    }

    setErrors(errorsTemp);

    const isErrors = Object.values(errorsTemp).some((val) => val !== '');
    if (isErrors)
      return;

    const saveEmp = () => {
      setLoading(true);
      if (id) {
        editItemApi(formData)
          .then(res => {
            if (!_.isEmpty(res.data)) {
              showSuccessNotification(EDITED_SUCCESS);
              fetchEmployeeList(currentPageIndex);
              setLoading(false);
              closeEmployee();
            }
          })
          .catch((error) => {
            showErrorNotification(error.messageContent);
            setLoading(false);
          });
      } else {
        createItemApi(formData)
          .then(res => {
            if (!_.isEmpty(res.data)) {
              showSuccessNotification(CREATED_SUCCESS);
              setLoading(false);
              const lastPageIndex = getTotalPages(total, ITEM_PER_PAGE);
              if (total % ITEM_PER_PAGE === 0) {
                fetchEmployeeList(lastPageIndex + 1);
              } else {
                fetchEmployeeList(lastPageIndex);
              }
              closeEmployee();
            }
          })
          .catch((error) => {
            showErrorNotification(error.messageContent);
            setLoading(false);
          });
      }
    };
    saveEmp();
  };

  const closeEmployee = () => {
    setIsOpen(false);
    setFormData(initFormData);
    setErrors(initErrors);
    setLoading(false);
  };

  return (
    <Spinner loading={loading}>
      <StyledEmployeeManagement>
        <Title text="Employee Management" />
        <div className="new-wrap">
          <Button
            className="secondary"
            onClick={() => setIsOpen(true)}
            text="New"
          />
        </div>
        <EmployeeTable
          employeeList={employeeList}
          total={total}
          currentPageIndex={currentPageIndex}
          getDetailEmployee={getDetailEmployee}
          deleteEmployee={deleteEmployee}
          fetchEmployeeList={fetchEmployeeList}
        />

        <StyledModal isOpen={isOpen} >
          <div className="modal-inner">
            <EmployeeForm
              formData={formData}
              errors={errors}
              handleInput={handleInput}
              submitForm={submitForm}
              closeEmployee={closeEmployee}
            />
          </div>
        </StyledModal>
      </StyledEmployeeManagement>
    </Spinner>

  )
}

Modal.setAppElement("#root");
export default EmployeeManagement;