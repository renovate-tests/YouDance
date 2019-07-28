import gql from "graphql-tag";
import * as React from "react";
import * as ReactApollo from "react-apollo";
import * as ReactApolloHooks from "react-apollo-hooks";
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Long: any;
  Date: any;
  Time: any;
};

export type Dance = {
  __typename?: "Dance";
  name: Scalars["String"];
  ballroom: Scalars["Boolean"];
  _id: Scalars["ID"];
  figures: FigurePage;
  latin: Scalars["Boolean"];
  _ts: Scalars["Long"];
};

export type DanceFiguresArgs = {
  _size?: Maybe<Scalars["Int"]>;
  _cursor?: Maybe<Scalars["String"]>;
};

export type DanceFiguresRelation = {
  create?: Maybe<Array<Maybe<FigureInput>>>;
  connect?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  disconnect?: Maybe<Array<Maybe<Scalars["ID"]>>>;
};

export type DanceInput = {
  name: Scalars["String"];
  ballroom: Scalars["Boolean"];
  latin: Scalars["Boolean"];
  figures?: Maybe<DanceFiguresRelation>;
};

export type DancePage = {
  __typename?: "DancePage";
  data: Array<Maybe<Dance>>;
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
};

export type Figure = {
  __typename?: "Figure";
  name: Scalars["String"];
  _id: Scalars["ID"];
  dance?: Maybe<Dance>;
  videos: FigureVideoPage;
  _ts: Scalars["Long"];
};

export type FigureVideosArgs = {
  _size?: Maybe<Scalars["Int"]>;
  _cursor?: Maybe<Scalars["String"]>;
};

export type FigureDanceRelation = {
  create?: Maybe<DanceInput>;
  connect?: Maybe<Scalars["ID"]>;
  disconnect?: Maybe<Scalars["Boolean"]>;
};

export type FigureInput = {
  name: Scalars["String"];
  videos?: Maybe<FigureVideosRelation>;
  dance?: Maybe<FigureDanceRelation>;
};

export type FigurePage = {
  __typename?: "FigurePage";
  data: Array<Maybe<Figure>>;
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
};

export type FigureVideo = {
  __typename?: "FigureVideo";
  _id: Scalars["ID"];
  end: Scalars["Int"];
  youtubeId: Scalars["String"];
  figure?: Maybe<Figure>;
  start: Scalars["Int"];
  _ts: Scalars["Long"];
};

export type FigureVideoFigureRelation = {
  create?: Maybe<FigureInput>;
  connect?: Maybe<Scalars["ID"]>;
  disconnect?: Maybe<Scalars["Boolean"]>;
};

export type FigureVideoInput = {
  youtubeId: Scalars["String"];
  start: Scalars["Int"];
  end: Scalars["Int"];
  figure?: Maybe<FigureVideoFigureRelation>;
};

export type FigureVideoPage = {
  __typename?: "FigureVideoPage";
  data: Array<Maybe<FigureVideo>>;
  after?: Maybe<Scalars["String"]>;
  before?: Maybe<Scalars["String"]>;
};

export type FigureVideosRelation = {
  create?: Maybe<Array<Maybe<FigureVideoInput>>>;
  connect?: Maybe<Array<Maybe<Scalars["ID"]>>>;
  disconnect?: Maybe<Array<Maybe<Scalars["ID"]>>>;
};

export type Mutation = {
  __typename?: "Mutation";
  updateDance?: Maybe<Dance>;
  deleteFigure?: Maybe<Figure>;
  createFigureVideo: FigureVideo;
  createDance: Dance;
  createFigure: Figure;
  deleteDance?: Maybe<Dance>;
  updateFigureVideo?: Maybe<FigureVideo>;
  deleteFigureVideo?: Maybe<FigureVideo>;
  updateFigure?: Maybe<Figure>;
};

export type MutationUpdateDanceArgs = {
  id: Scalars["ID"];
  data: DanceInput;
};

export type MutationDeleteFigureArgs = {
  id: Scalars["ID"];
};

export type MutationCreateFigureVideoArgs = {
  data: FigureVideoInput;
};

export type MutationCreateDanceArgs = {
  data: DanceInput;
};

export type MutationCreateFigureArgs = {
  data: FigureInput;
};

export type MutationDeleteDanceArgs = {
  id: Scalars["ID"];
};

export type MutationUpdateFigureVideoArgs = {
  id: Scalars["ID"];
  data: FigureVideoInput;
};

export type MutationDeleteFigureVideoArgs = {
  id: Scalars["ID"];
};

export type MutationUpdateFigureArgs = {
  id: Scalars["ID"];
  data: FigureInput;
};

export type Query = {
  __typename?: "Query";
  findFigureVideoByID?: Maybe<FigureVideo>;
  findFigureByID?: Maybe<Figure>;
  findDanceByID?: Maybe<Dance>;
  dances: DancePage;
};

export type QueryFindFigureVideoByIdArgs = {
  id: Scalars["ID"];
};

export type QueryFindFigureByIdArgs = {
  id: Scalars["ID"];
};

export type QueryFindDanceByIdArgs = {
  id: Scalars["ID"];
};

export type QueryDancesArgs = {
  _size?: Maybe<Scalars["Int"]>;
  _cursor?: Maybe<Scalars["String"]>;
};

export type VideosByFigureQueryVariables = {
  figureId: Scalars["ID"];
  size?: Maybe<Scalars["Int"]>;
};

export type VideosByFigureQuery = { __typename?: "Query" } & {
  findFigureByID: Maybe<
    { __typename?: "Figure" } & {
      videos: { __typename?: "FigureVideoPage" } & {
        data: Array<
          Maybe<
            { __typename?: "FigureVideo" } & Pick<
              FigureVideo,
              "youtubeId" | "start" | "end"
            >
          >
        >;
      };
    }
  >;
};

export type AddDanceMutationVariables = {
  name: Scalars["String"];
  ballroom: Scalars["Boolean"];
  latin: Scalars["Boolean"];
};

export type AddDanceMutation = { __typename?: "Mutation" } & {
  createDance: { __typename?: "Dance" } & Pick<Dance, "_id" | "name">;
};

export type DancesQueryVariables = {};

export type DancesQuery = { __typename?: "Query" } & {
  dances: { __typename?: "DancePage" } & {
    data: Array<Maybe<{ __typename?: "Dance" } & Pick<Dance, "_id" | "name">>>;
  };
};

export type AddFigureMutationVariables = {
  name: Scalars["String"];
  dance: Scalars["ID"];
};

export type AddFigureMutation = { __typename?: "Mutation" } & {
  createFigure: { __typename?: "Figure" } & Pick<Figure, "_id">;
};

export type AddFigureVideoMutationVariables = {
  youtubeId: Scalars["String"];
  start: Scalars["Int"];
  end: Scalars["Int"];
  figureId: Scalars["ID"];
};

export type AddFigureVideoMutation = { __typename?: "Mutation" } & {
  createFigureVideo: { __typename?: "FigureVideo" } & Pick<FigureVideo, "_id">;
};

export type DancesAndFiguresQueryVariables = {};

export type DancesAndFiguresQuery = { __typename?: "Query" } & {
  dances: { __typename?: "DancePage" } & {
    data: Array<
      Maybe<
        { __typename?: "Dance" } & Pick<Dance, "_id" | "name"> & {
            figures: { __typename?: "FigurePage" } & {
              data: Array<
                Maybe<
                  { __typename?: "Figure" } & Pick<Figure, "_id" | "name"> & {
                      videos: { __typename?: "FigureVideoPage" } & {
                        data: Array<
                          Maybe<
                            { __typename?: "FigureVideo" } & Pick<
                              FigureVideo,
                              "youtubeId"
                            >
                          >
                        >;
                      };
                    }
                >
              >;
            };
          }
      >
    >;
  };
};

export const VideosByFigureDocument = gql`
  query VideosByFigure($figureId: ID!, $size: Int = 4) {
    findFigureByID(id: $figureId) {
      videos(_size: $size) {
        data {
          youtubeId
          start
          end
        }
      }
    }
  }
`;
export type VideosByFigureComponentProps = Omit<
  ReactApollo.QueryProps<VideosByFigureQuery, VideosByFigureQueryVariables>,
  "query"
> &
  ({ variables: VideosByFigureQueryVariables; skip?: false } | { skip: true });

export const VideosByFigureComponent = (
  props: VideosByFigureComponentProps
) => (
  <ReactApollo.Query<VideosByFigureQuery, VideosByFigureQueryVariables>
    query={VideosByFigureDocument}
    {...props}
  />
);

export type VideosByFigureProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<VideosByFigureQuery, VideosByFigureQueryVariables>
> &
  TChildProps;
export function withVideosByFigure<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    VideosByFigureQuery,
    VideosByFigureQueryVariables,
    VideosByFigureProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    VideosByFigureQuery,
    VideosByFigureQueryVariables,
    VideosByFigureProps<TChildProps>
  >(VideosByFigureDocument, {
    alias: "withVideosByFigure",
    ...operationOptions
  });
}

export function useVideosByFigureQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<VideosByFigureQueryVariables>
) {
  return ReactApolloHooks.useQuery<
    VideosByFigureQuery,
    VideosByFigureQueryVariables
  >(VideosByFigureDocument, baseOptions);
}
export type VideosByFigureQueryHookResult = ReturnType<
  typeof useVideosByFigureQuery
>;
export const AddDanceDocument = gql`
  mutation AddDance($name: String!, $ballroom: Boolean!, $latin: Boolean!) {
    createDance(data: { name: $name, ballroom: $ballroom, latin: $latin }) {
      _id
      name
    }
  }
`;
export type AddDanceMutationFn = ReactApollo.MutationFn<
  AddDanceMutation,
  AddDanceMutationVariables
>;
export type AddDanceComponentProps = Omit<
  ReactApollo.MutationProps<AddDanceMutation, AddDanceMutationVariables>,
  "mutation"
>;

export const AddDanceComponent = (props: AddDanceComponentProps) => (
  <ReactApollo.Mutation<AddDanceMutation, AddDanceMutationVariables>
    mutation={AddDanceDocument}
    {...props}
  />
);

export type AddDanceProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<AddDanceMutation, AddDanceMutationVariables>
> &
  TChildProps;
export function withAddDance<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    AddDanceMutation,
    AddDanceMutationVariables,
    AddDanceProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    AddDanceMutation,
    AddDanceMutationVariables,
    AddDanceProps<TChildProps>
  >(AddDanceDocument, {
    alias: "withAddDance",
    ...operationOptions
  });
}

export function useAddDanceMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    AddDanceMutation,
    AddDanceMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    AddDanceMutation,
    AddDanceMutationVariables
  >(AddDanceDocument, baseOptions);
}
export type AddDanceMutationHookResult = ReturnType<typeof useAddDanceMutation>;
export const DancesDocument = gql`
  query Dances {
    dances {
      data {
        _id
        name
      }
    }
  }
`;
export type DancesComponentProps = Omit<
  ReactApollo.QueryProps<DancesQuery, DancesQueryVariables>,
  "query"
>;

export const DancesComponent = (props: DancesComponentProps) => (
  <ReactApollo.Query<DancesQuery, DancesQueryVariables>
    query={DancesDocument}
    {...props}
  />
);

export type DancesProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<DancesQuery, DancesQueryVariables>
> &
  TChildProps;
export function withDances<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    DancesQuery,
    DancesQueryVariables,
    DancesProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    DancesQuery,
    DancesQueryVariables,
    DancesProps<TChildProps>
  >(DancesDocument, {
    alias: "withDances",
    ...operationOptions
  });
}

export function useDancesQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<DancesQueryVariables>
) {
  return ReactApolloHooks.useQuery<DancesQuery, DancesQueryVariables>(
    DancesDocument,
    baseOptions
  );
}
export type DancesQueryHookResult = ReturnType<typeof useDancesQuery>;
export const AddFigureDocument = gql`
  mutation AddFigure($name: String!, $dance: ID!) {
    createFigure(data: { name: $name, dance: { connect: $dance } }) {
      _id
    }
  }
`;
export type AddFigureMutationFn = ReactApollo.MutationFn<
  AddFigureMutation,
  AddFigureMutationVariables
>;
export type AddFigureComponentProps = Omit<
  ReactApollo.MutationProps<AddFigureMutation, AddFigureMutationVariables>,
  "mutation"
>;

export const AddFigureComponent = (props: AddFigureComponentProps) => (
  <ReactApollo.Mutation<AddFigureMutation, AddFigureMutationVariables>
    mutation={AddFigureDocument}
    {...props}
  />
);

export type AddFigureProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<AddFigureMutation, AddFigureMutationVariables>
> &
  TChildProps;
export function withAddFigure<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    AddFigureMutation,
    AddFigureMutationVariables,
    AddFigureProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    AddFigureMutation,
    AddFigureMutationVariables,
    AddFigureProps<TChildProps>
  >(AddFigureDocument, {
    alias: "withAddFigure",
    ...operationOptions
  });
}

export function useAddFigureMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    AddFigureMutation,
    AddFigureMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    AddFigureMutation,
    AddFigureMutationVariables
  >(AddFigureDocument, baseOptions);
}
export type AddFigureMutationHookResult = ReturnType<
  typeof useAddFigureMutation
>;
export const AddFigureVideoDocument = gql`
  mutation AddFigureVideo(
    $youtubeId: String!
    $start: Int!
    $end: Int!
    $figureId: ID!
  ) {
    createFigureVideo(
      data: {
        youtubeId: $youtubeId
        start: $start
        end: $end
        figure: { connect: $figureId }
      }
    ) {
      _id
    }
  }
`;
export type AddFigureVideoMutationFn = ReactApollo.MutationFn<
  AddFigureVideoMutation,
  AddFigureVideoMutationVariables
>;
export type AddFigureVideoComponentProps = Omit<
  ReactApollo.MutationProps<
    AddFigureVideoMutation,
    AddFigureVideoMutationVariables
  >,
  "mutation"
>;

export const AddFigureVideoComponent = (
  props: AddFigureVideoComponentProps
) => (
  <ReactApollo.Mutation<AddFigureVideoMutation, AddFigureVideoMutationVariables>
    mutation={AddFigureVideoDocument}
    {...props}
  />
);

export type AddFigureVideoProps<TChildProps = {}> = Partial<
  ReactApollo.MutateProps<
    AddFigureVideoMutation,
    AddFigureVideoMutationVariables
  >
> &
  TChildProps;
export function withAddFigureVideo<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    AddFigureVideoMutation,
    AddFigureVideoMutationVariables,
    AddFigureVideoProps<TChildProps>
  >
) {
  return ReactApollo.withMutation<
    TProps,
    AddFigureVideoMutation,
    AddFigureVideoMutationVariables,
    AddFigureVideoProps<TChildProps>
  >(AddFigureVideoDocument, {
    alias: "withAddFigureVideo",
    ...operationOptions
  });
}

export function useAddFigureVideoMutation(
  baseOptions?: ReactApolloHooks.MutationHookOptions<
    AddFigureVideoMutation,
    AddFigureVideoMutationVariables
  >
) {
  return ReactApolloHooks.useMutation<
    AddFigureVideoMutation,
    AddFigureVideoMutationVariables
  >(AddFigureVideoDocument, baseOptions);
}
export type AddFigureVideoMutationHookResult = ReturnType<
  typeof useAddFigureVideoMutation
>;
export const DancesAndFiguresDocument = gql`
  query DancesAndFigures {
    dances {
      data {
        _id
        name
        figures {
          data {
            _id
            name
            videos {
              data {
                youtubeId
              }
            }
          }
        }
      }
    }
  }
`;
export type DancesAndFiguresComponentProps = Omit<
  ReactApollo.QueryProps<DancesAndFiguresQuery, DancesAndFiguresQueryVariables>,
  "query"
>;

export const DancesAndFiguresComponent = (
  props: DancesAndFiguresComponentProps
) => (
  <ReactApollo.Query<DancesAndFiguresQuery, DancesAndFiguresQueryVariables>
    query={DancesAndFiguresDocument}
    {...props}
  />
);

export type DancesAndFiguresProps<TChildProps = {}> = Partial<
  ReactApollo.DataProps<DancesAndFiguresQuery, DancesAndFiguresQueryVariables>
> &
  TChildProps;
export function withDancesAndFigures<TProps, TChildProps = {}>(
  operationOptions?: ReactApollo.OperationOption<
    TProps,
    DancesAndFiguresQuery,
    DancesAndFiguresQueryVariables,
    DancesAndFiguresProps<TChildProps>
  >
) {
  return ReactApollo.withQuery<
    TProps,
    DancesAndFiguresQuery,
    DancesAndFiguresQueryVariables,
    DancesAndFiguresProps<TChildProps>
  >(DancesAndFiguresDocument, {
    alias: "withDancesAndFigures",
    ...operationOptions
  });
}

export function useDancesAndFiguresQuery(
  baseOptions?: ReactApolloHooks.QueryHookOptions<
    DancesAndFiguresQueryVariables
  >
) {
  return ReactApolloHooks.useQuery<
    DancesAndFiguresQuery,
    DancesAndFiguresQueryVariables
  >(DancesAndFiguresDocument, baseOptions);
}
export type DancesAndFiguresQueryHookResult = ReturnType<
  typeof useDancesAndFiguresQuery
>;
