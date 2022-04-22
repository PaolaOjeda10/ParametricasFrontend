import { useState } from 'react';

export const useForm = (keys) => {
  const [form, setForm] = useState({
    values: Object.keys(keys).reduce((container, key) => {
      container[key] = '';
      return container;
    }, {}),
    errors: Object.keys(keys).reduce((container, key) => {
      container[key] = true;
      return container;
    }, {}),
    touched: Object.keys(keys).reduce((container, key) => {
      container[key] = false;
      return container;
    }, {}),
  });
  return {
    errors: form.errors,
    values: form.values,
    touched: form.touched,
    reset: () => {
      setForm({
        values: Object.keys(keys).reduce((container, key) => {
          container[key] = '';
          return container;
        }, {}),
        errors: Object.keys(keys).reduce((container, key) => {
          container[key] = true;
          return container;
        }, {}),
        touched: Object.keys(keys).reduce((container, key) => {
          container[key] = false;
          return container;
        }, {}),
      });
    },
    setTouched: () => {
      setForm((form) => ({
        ...form,
        touched: Object.keys(keys).reduce((container, key) => {
          container[key] = true;
          return container;
        }, {}),
      }));
    },
    setValues: (data) => {
      setForm((form) => ({
        ...form,
        values: data,
        touched: Object.keys(keys).reduce((container, key) => {
          container[key] = true;
          return container;
        }, {}),
        errors: Object.keys(keys).reduce((container, key) => {
          container[key] = (data[key] || '').length === 0;
          return container;
        }, {}),
      }));
    },
    addValue: ({ target: { name, value } }) => {
      setForm((form) => ({
        ...form,
        values: {
          ...form.values,
          [name]: value,
        },
        errors: {
          ...form.errors,
          [name]: (value || '').length === 0,
        },
        touched: {
          ...form.touched,
          [name]: true,
        },
      }));
    },
  };
};
