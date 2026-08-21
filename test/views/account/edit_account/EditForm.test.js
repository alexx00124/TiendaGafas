import React from 'react';
import { shallow } from 'enzyme';

jest.mock('formik', () => ({
  useFormikContext: jest.fn(),
  Field: (props) => <div className="mock-field" data-name={props.name}>{props.label}</div>
}));

jest.mock('@/components/formik', () => ({
  CustomInput: () => <div className="mock-custom-input" />,
  CustomMobileInput: () => <div className="mock-mobile-input" />
}));

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(() => ({ push: jest.fn() }))
}));

import EditForm from '@/views/account/edit_account/EditForm';
import { useFormikContext } from 'formik';
import { useHistory } from 'react-router-dom';
import { ACCOUNT } from '@/constants/routes';

describe('EditForm', () => {
  beforeEach(() => {
    useFormikContext.mockReturnValue({
      values: { fullname: 'John', mobile: '' },
      submitForm: jest.fn()
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const wrapper = shallow(<EditForm isLoading={false} authProvider="password" />);
    expect(wrapper.exists()).toBe(true);
  });

  it('renders three Field components', () => {
    const wrapper = shallow(<EditForm isLoading={false} authProvider="password" />);
    expect(wrapper.find('Field')).toHaveLength(3);
  });

  it('renders Full Name field via Field data-name', () => {
    const wrapper = shallow(<EditForm isLoading={false} authProvider="password" />);
    const nameField = wrapper.find('Field').filterWhere((f) => f.prop('name') === 'fullname');
    expect(nameField.exists()).toBe(true);
    expect(nameField.prop('label')).toBe('* Full Name');
  });

  it('renders Email Address field via Field data-name', () => {
    const wrapper = shallow(<EditForm isLoading={false} authProvider="password" />);
    const emailField = wrapper.find('Field').filterWhere((f) => f.prop('name') === 'email');
    expect(emailField.exists()).toBe(true);
    expect(emailField.prop('label')).toBe('* Email Address');
  });

  it('renders Update Profile button', () => {
    const wrapper = shallow(<EditForm isLoading={false} authProvider="password" />);
    const buttons = wrapper.find('button');
    const updateBtn = buttons.filterWhere((b) => b.text().includes('Update Profile'));
    expect(updateBtn.exists()).toBe(true);
  });

  it('renders Back to Profile button', () => {
    const wrapper = shallow(<EditForm isLoading={false} authProvider="password" />);
    const buttons = wrapper.find('button');
    const backBtn = buttons.filterWhere((b) => b.text().includes('Back to Profile'));
    expect(backBtn.exists()).toBe(true);
  });

  it('navigates back to account on Back to Profile click', () => {
    const pushSpy = jest.fn();
    useHistory.mockReturnValue({ push: pushSpy });
    const wrapper = shallow(<EditForm isLoading={false} authProvider="password" />);
    wrapper.find('.button-muted').simulate('click');
    expect(pushSpy).toHaveBeenCalledWith(ACCOUNT);
  });

  it('submits the form through formik submitForm on Update Profile click', () => {
    const submitForm = jest.fn();
    useFormikContext.mockReturnValue({
      values: { fullname: 'John', mobile: '' },
      submitForm
    });
    const wrapper = shallow(<EditForm isLoading={false} authProvider="password" />);
    wrapper.find('.edit-user-action .button').last().simulate('click');
    expect(submitForm).toHaveBeenCalledTimes(1);
  });
});
