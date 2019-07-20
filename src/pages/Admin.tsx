import * as React from "react";
import { Card, CardContent } from "@material-ui/core";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAddDanceMutation } from "../generated/graphql";

function DanceForm() {
  const [addDance] = useAddDanceMutation();

  return (
    <Formik
      initialValues={{ name: "", latin: false, ballroom: false }}
      validate={values => {
        if (!values.name) {
          return { name: "Required" };
        }
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        resetForm();
        addDance({ variables: values }).then(() => {
          setSubmitting(false);
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <span>name</span>
          <Field name="name" />
          <ErrorMessage name="name" component="div" />
          <span>latin</span>
          <Field type="checkbox" name="latin" />
          <span>ballroom</span>
          <Field type="checkbox" name="ballroom" />
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default function Admin() {
  return (
    <Card>
      <CardContent>
        <h3>Create Dance</h3>

        <DanceForm />
      </CardContent>
    </Card>
  );
}
