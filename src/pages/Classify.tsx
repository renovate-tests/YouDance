import * as React from "react";
import {
  Box,
  CircularProgress,
  Snackbar,
  SnackbarContent
} from "@material-ui/core";
import { match } from "react-router";
import ReactPlayer from "react-player";

import {
  useFindDanceQuery,
  useAddFigureMutation,
  useAddFigureVideoMutation,
  useDancesAndFiguresQuery,
  FindDanceQuery
} from "../generated/graphql";

import "./Classify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { getUniqueFigures } from "./Main";

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

function AddFigureForm({
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

interface YoutubeVideoResponse {
  id: {
    videoId: string;
  };
}

async function getYoutubeVideos(danceName: string) {
  const searchTerm = encodeURIComponent(`wdsf ${danceName}`);
  const apiKey = "AIzaSyCkD0MSqi0g9ZYCqk3C9QXXNJ0Ykdoh354";
  return fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${searchTerm}&key=${apiKey}`
  ).then(res => res.json());
}

interface VideoClassificationProps {
  danceName: string;
  danceId: string;
  knownYoutubeIds: string[] | null;
}

function VideoClassification({
  danceName,
  danceId,
  knownYoutubeIds
}: VideoClassificationProps) {
  const [playbackTime, setPlaybackTime] = React.useState(0);
  const { data, loading } = useDancesAndFiguresQuery();
  const [youtubeResponse, setYoutubeResponse] = React.useState();
  // Search video on youtube

  React.useEffect(() => {
    getYoutubeVideos(danceName).then(result => setYoutubeResponse(result));
  }, [danceName]);

  if (!youtubeResponse || loading || !data || !knownYoutubeIds) {
    return <CircularProgress />;
  }

  // TODO: only load what we need
  const figures = getUniqueFigures(data).filter(
    item => item.danceId === danceId
  );

  let youtubeId = null;
  if (youtubeResponse && youtubeResponse.items) {
    const youtubeIds = youtubeResponse.items.map(
      (item: YoutubeVideoResponse) => item.id.videoId
    );
    const filteredIds = youtubeIds.filter((item: string) => {
      return !knownYoutubeIds.includes(item);
    });

    if (filteredIds.length) {
      youtubeId = filteredIds[0];
    } else {
      youtubeId = youtubeIds[0];
    }
  }

  if (!youtubeId) {
    return null;
  }

  return (
    <>
      <ReactPlayer
        className="Classify-review"
        url={"https://www.youtube.com/watch?v=" + youtubeId}
        onProgress={({ playedSeconds }) =>
          setPlaybackTime(Math.floor(playedSeconds))
        }
      />

      <AddFigureForm
        currentPlaybackTime={playbackTime}
        danceId={danceId}
        youtubeId={youtubeId}
        knownFigures={figures}
      />
    </>
  );
}

type DanceType = FindDanceQuery["findDanceByID"];
function getYoutubeIds(dance: DanceType): string[] {
  if (!dance) {
    return [];
  }

  return (dance.figures.data || [])
    .reduce(
      (carry, figure) => {
        if (!figure) {
          return carry;
        }

        const youtubeIds = (figure.videos.data || []).map(video =>
          video ? video.youtubeId : ""
        );

        return [...carry, ...youtubeIds];
      },
      [] as string[]
    )
    .filter(youtubeId => youtubeId !== "");
}

interface ClassifyProps {
  match: match<{ id: string }>;
}
// TODO: if no id is present we should request a dance from the backend
export default function Classify({ match }: ClassifyProps) {
  const [knownYoutubeIds, setYoutubeIds] = React.useState<null | string[]>(
    null
  );

  const id = match.params.id;
  // Load dance from ID (we need this for the search)
  const { data, loading } = useFindDanceQuery({
    variables: { id }
  });

  if (loading || !data || !data.findDanceByID) {
    return <CircularProgress />;
  }

  const dance = data.findDanceByID;

  if (knownYoutubeIds === null) {
    setYoutubeIds(getYoutubeIds(data.findDanceByID));
  }

  return (
    <Box m={4}>
      <h1>Help us get new videos for {dance.name}</h1>
      <VideoClassification
        danceId={id}
        danceName={dance.name}
        knownYoutubeIds={knownYoutubeIds}
      />
    </Box>
  );
}
