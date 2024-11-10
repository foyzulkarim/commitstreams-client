import PropTypes from 'prop-types';
import { FormProvider as Form } from 'react-hook-form';

// ----------------------------------------------------------------------

export default function FormProvider({ children, methods, onSubmit }) {
  return (
    <Form {...methods}>
      <form onSubmit={onSubmit}>{children}</form>
    </Form>
  );
}

FormProvider.propTypes = {
  children: PropTypes.node,
  methods: PropTypes.object,
  onSubmit: PropTypes.func,
};
