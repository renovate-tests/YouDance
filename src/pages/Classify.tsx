import * as React from "react";
import {
  Box,
  CircularProgress,
  Snackbar,
  SnackbarContent
} from "@material-ui/core";
import { match } from "react-router";
import {
  useFindDanceQuery,
  useAddFigureMutation,
  useAddFigureVideoMutation,
  useDancesAndFiguresQuery
} from "../generated/graphql";

import "./Classify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { getUniqueFigures } from "./Main";

interface Figure {
  label: string;
  figureId: string;
}

interface AddFigureFormProps {
  danceId: string;
  youtubeId: string;
  knownFigures: Figure[];
}

function AddFigureForm({
  knownFigures,
  danceId,
  youtubeId
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
            <ErrorMessage name="start" component="div" />

            <span>End (in s)</span>
            <Field type="number" name="end" />
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

async function getYoutubeVideoId(danceName: string) {
  const searchTerm = encodeURIComponent(`wdsf ${danceName}`);
  const apiKey = "AIzaSyCkD0MSqi0g9ZYCqk3C9QXXNJ0Ykdoh354";
  return fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchTerm}&key=${apiKey}`
  )
    .then(res => res.json())
    .then(response => {
      if (
        response &&
        response.items &&
        response.items[0] &&
        response.items[0].id &&
        response.items[0].id.videoId
      ) {
        return response.items[0].id.videoId;
      } else {
        return null;
      }
    });
}

interface VideoClassificationProps {
  danceName: string;
  danceId: string;
}

function VideoClassification({ danceName, danceId }: VideoClassificationProps) {
  const { data, loading } = useDancesAndFiguresQuery();
  const [youtubeId, setYoutubId] = React.useState();
  // Search video on youtube

  React.useEffect(() => {
    getYoutubeVideoId(danceName).then(result => setYoutubId(result));
  });

  if (!youtubeId || loading || !data) {
    return <CircularProgress />;
  }
  // TODO: only load what we need
  const figures = getUniqueFigures(data).filter(
    item => item.danceId === danceId
  );

  return (
    <>
      <iframe
        className="Classify-review"
        src={"https://www.youtube.com/embed/" + youtubeId}
      />
      <AddFigureForm
        danceId={danceId}
        youtubeId={youtubeId}
        knownFigures={figures}
      />
    </>
  );
}

interface ClassifyProps {
  match: match<{ id: string }>;
}
// TODO: if no id is present we should request a dance from the backend
export default function Classify({ match }: ClassifyProps) {
  const id = match.params.id;
  // Load dance from ID (we need this for the search)
  const { data, loading } = useFindDanceQuery({
    variables: { id }
  });

  if (loading || !data || !data.findDanceByID) {
    return <CircularProgress />;
  }

  const danceName = data.findDanceByID.name;

  return (
    <Box m={4}>
      <h1>Help us get new videos for {danceName}</h1>
      <VideoClassification danceId={id} danceName={danceName} />
    </Box>
  );
}
