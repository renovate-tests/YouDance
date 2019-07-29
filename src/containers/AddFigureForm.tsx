import * as React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  CircularProgress,
  Snackbar,
  SnackbarContent,
  MenuItem,
  FormGroup,
  Box,
  Button
} from "@material-ui/core";
import { TextField, Select } from "formik-material-ui";

import {
  useAddFigureMutation,
  useAddFigureVideoMutation
} from "../generated/graphql";

import "./AddFigureForm.css";

interface NowProps {
  onClick(): void;
  className: string;
}

function Now({ onClick, className }: NowProps) {
  return (
    <Button
      component="a"
      variant="contained"
      className={className}
      onClick={onClick}
    >
      Now
    </Button>
  );
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
            <FormGroup className="Add-Figure-Form">
              <Box m={4}>
                <FormGroup row>
                  <span className="Label-Spacing">Figure</span>
                  <Field component={Select} name="figureSelection">
                    <MenuItem value="" />
                    {knownFigures
                      .sort((a, b) => a.label.localeCompare(b.label))
                      .map(figure => {
                        return (
                          <MenuItem
                            key={figure.figureId}
                            value={figure.figureId}
                          >
                            {/* TODO: find a cleaner solution / abstraction for this hack */}
                            {figure.label.split(" in")[0]}
                          </MenuItem>
                        );
                      })}
                    <MenuItem value="new-figure">Add new Figure</MenuItem>
                  </Field>
                  <ErrorMessage name="figureSelection" component="div" />
                  {form.values.figureSelection === "new-figure" ? (
                    <div className="New-Figure">
                      <Field component={TextField} name="newFigure" />
                    </div>
                  ) : null}
                </FormGroup>
              </Box>

              <Box m={4}>
                <FormGroup row>
                  <span className="Label-Spacing">Start (in s)</span>
                  <Field component={TextField} type="number" name="start" />
                  <Now
                    className="Now-Spacing"
                    onClick={() =>
                      form.setFieldValue("start", currentPlaybackTime)
                    }
                  />
                  <ErrorMessage name="start" component="div" />
                </FormGroup>
              </Box>

              <Box m={4}>
                <FormGroup row>
                  <span className="Label-Spacing">End (in s)</span>
                  <Field component={TextField} type="number" name="end" />
                  <Now
                    className="Now-Spacing"
                    onClick={() =>
                      form.setFieldValue("end", currentPlaybackTime)
                    }
                  />
                  <ErrorMessage name="end" component="div" />
                </FormGroup>
              </Box>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={form.isSubmitting || !form.isValid}
              >
                Add Figure
              </Button>

              {form.isSubmitting ? <CircularProgress /> : null}
            </FormGroup>
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
