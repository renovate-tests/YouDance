import * as React from "react";
import { Card, CardContent } from "@material-ui/core";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  useAddDanceMutation,
  useAddFigureMutation,
  useDancesQuery,
  useDancesAndFiguresQuery,
  useAddFigureVideoMutation
} from "../generated/graphql";
import { getUniqueFigures } from "./Main";

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

function FigureForm() {
  const { data, loading } = useDancesQuery();
  const [addFigure] = useAddFigureMutation();

  if (loading) {
    return null;
  }

  const dances = data ? data.dances.data.filter(dance => dance) : [];

  return (
    <Formik
      initialValues={{ name: "", dance: "" }}
      validate={values => {
        if (!values.name) {
          return { name: "Required" };
        }

        if (
          !dances
            .map(dance => (dance ? dance._id : null))
            .filter(dance => dance)
            .includes(values.dance)
        ) {
          return { danceId: "Must be a known dance" };
        }
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        resetForm();
        addFigure({ variables: values }).then(() => {
          setSubmitting(false);
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <span>name</span>
          <Field name="name" />
          <ErrorMessage name="name" component="div" />

          <Field component="select" name="dance">
            <option value="" />
            {dances.map(dance => {
              if (!dance) {
                return null;
              }

              return (
                <option key={dance._id} value={dance._id}>
                  {dance.name}
                </option>
              );
            })}
          </Field>
          <ErrorMessage name="dance" component="div" />

          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
}

function FigureVideoForm() {
  const { data, loading } = useDancesAndFiguresQuery();
  const [addFigureVideo] = useAddFigureVideoMutation();

  if (loading || !data) {
    return null;
  }
  const figures = getUniqueFigures(data);

  return (
    <Formik
      initialValues={{ youtubeId: "", figureId: "", start: 0, end: 0 }}
      validate={values => {
        if (!values.youtubeId) {
          return { youtubeId: "Required" };
        }
      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        resetForm();

        addFigureVideo({ variables: values }).then(() => {
          setSubmitting(false);
        });
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <span>Youtube ID</span>
          <Field name="youtubeId" />
          <ErrorMessage name="youtubeId" component="div" />

          <span>Start (in s)</span>
          <Field type="number" name="start" />
          <ErrorMessage name="start" component="div" />

          <span>End (in s)</span>
          <Field type="number" name="end" />
          <ErrorMessage name="end" component="div" />

          <Field component="select" name="figureId">
            <option value="" />
            {figures.map(figure => {
              return (
                <option key={figure.figureId} value={figure.figureId}>
                  {figure.label}
                </option>
              );
            })}
          </Field>
          <ErrorMessage name="figureId" component="div" />

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
    <>
      <Card>
        <CardContent>
          <h3>Create Dance</h3>

          <DanceForm />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3>Create Figure</h3>

          <FigureForm />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3>Create FigureVide</h3>

          <FigureVideoForm />
        </CardContent>
      </Card>
    </>
  );
}
