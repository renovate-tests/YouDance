import * as React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { CircularProgress, Snackbar, SnackbarContent } from "@material-ui/core";

import {
  useAddFigureMutation,
  useAddFigureVideoMutation
} from "../generated/graphql";

interface NowProps {
  onClick(): void;
}

function Now({ onClick }: NowProps) {
  return <button onClick={onClick}>Now</button>;
}

interface Figure {
  label: string;
  figureId: string;
}

interface AddFigureFormProps {
  danceId: string;
  youtubeId: string;
  knownFigures: Figure[];
  currentPlaybackTime: number;
}

export default function AddFigureForm({
  knownFigures,
  danceId,
  youtubeId,
  currentPlaybackTime
}: AddFigureFormProps) {
  const [addFigure] = useAddFigureMutation();
  const [addFigureVideo] = useAddFigureVideoMutation();
  const [showSuccessMessage, showSuccess] = React.useState(false);

  return (
    <>
      <Formik
        initialValues={{ figureSelection: "", newFigure: "", start: 0, end: 0 }}
        validate={values => {
          if (!values.figureSelection) {
            return { figureSelection: "Required" };
          }

          if (values.figureSelection === "new-figure") {
            if (!values.newFigure) {
              return {
                newFigure: "Required"
              };
            }
          }

          if (!values.start) {
            return { start: "Required" };
          }
          if (!values.end) {
            return { end: "Required" };
          }

          if (values.start >= values.end) {
            return { start: "Must be smaller than end" };
          }
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          resetForm();

          const figureIdPromise =
            values.figureSelection === "new-figure"
              ? addFigure({
                  variables: { dance: danceId, name: values.newFigure }
                }).then(value => value.data.createFigure._id)
              : Promise.resolve(values.figureSelection);

          figureIdPromise
            .then(figureId =>
              addFigureVideo({
                variables: {
                  figureId,
                  youtubeId,
                  start: values.start,
                  end: values.end
                }
              })
            )
            .then(() => {
              setSubmitting(false);
              showSuccess(true);
            });
        }}
      >
        {form => (
          <Form>
            <Field component="select" name="figureSelection">
              <option value="" />
              {knownFigures
                .sort((a, b) => a.label.localeCompare(b.label))
                .map(figure => {
                  return (
                    <option key={figure.figureId} value={figure.figureId}>
                      {/* TODO: find a cleaner solution / abstraction for this hack */}
                      {figure.label.split(" in")[0]}
                    </option>
                  );
                })}
              <option value="new-figure">Add new Figure</option>
            </Field>
            <ErrorMessage name="figureSelection" component="div" />

            {form.values.figureSelection === "new-figure" ? (
              <>
                <Field name="newFigure" />
                <ErrorMessage name="newFigure" component="div" />
              </>
            ) : null}

            <span>Start (in s)</span>
            <Field type="number" name="start" />
            <Now
              onClick={() => form.setFieldValue("start", currentPlaybackTime)}
            />
            <ErrorMessage name="start" component="div" />

            <span>End (in s)</span>
            <Field type="number" name="end" />
            <Now
              onClick={() => form.setFieldValue("end", currentPlaybackTime)}
            />
            <ErrorMessage name="end" component="div" />

            <button type="submit" disabled={form.isSubmitting || !form.isValid}>
              Add Figure
            </button>

            {form.isSubmitting ? <CircularProgress /> : null}
          </Form>
        )}
      </Formik>

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={showSuccessMessage}
        autoHideDuration={6000}
        onClose={() => showSuccess(false)}
      >
        <SnackbarContent
          aria-describedby="add-success"
          message={
            <span id="add-success">Successfully added a new Figure</span>
          }
        />
      </Snackbar>
    </>
  );
}
