import gql from "graphql-tag";
import * as ReactApollo from "react-apollo";
import * as React from "react";
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

export type AddDanceMutationVariables = {
  name: Scalars["String"];
  ballroom: Scalars["Boolean"];
  latin: Scalars["Boolean"];
};

export type AddDanceMutation = { __typename?: "Mutation" } & {
  createDance: { __typename?: "Dance" } & Pick<Dance, "_id" | "name">;
};

export type DancesAndFiguresQueryVariables = {};

export type DancesAndFiguresQuery = { __typename?: "Query" } & {
  dances: { __typename?: "DancePage" } & {
    data: Array<
      Maybe<
        { __typename?: "Dance" } & Pick<Dance, "name"> & {
            figures: { __typename?: "FigurePage" } & {
              data: Array<
                Maybe<{ __typename?: "Figure" } & Pick<Figure, "name">>
              >;
            };
          }
      >
    >;
  };
};

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
export const DancesAndFiguresDocument = gql`
  query DancesAndFigures {
    dances {
      data {
        name
        figures {
          data {
            name
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
