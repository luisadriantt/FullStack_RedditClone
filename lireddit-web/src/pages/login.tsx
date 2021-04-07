import React from "react";

import { Formik, Form } from "formik";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { withApollo } from "../utils/withApollo";

// In Next js the name of the files inside pages will be routes
const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [login] = useLoginMutation(); // first parameter is info about mutation, second is the funtion name

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ variables: values });
          // response.data.register.errors -> if there is no data will throw an error (break the app)
          // response.data?.register.errors -> if ther is no data will throw undefine
          // optional chaining from typescript
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if (typeof router.query.next === "string") {
              // if there is a route insede next then redirect to that route
              router.push(router.query.next);
            } else {
              router.push("/");
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              label="username or email"
              placeholder="username or email"
            />
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="password"
                type="password"
              />
            </Box>
            <Flex mt={2}>
              <NextLink href="/forgot-password">
                <Link ml="auto" color="teal.500" href="#">
                  Forgot Password?
                </Link>
              </NextLink>
            </Flex>
            <Button
              mt={4}
              isLoading={isSubmitting}
              type="submit"
              color="green.500"
            >
              login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withApollo({ ssr: false })(Login);
