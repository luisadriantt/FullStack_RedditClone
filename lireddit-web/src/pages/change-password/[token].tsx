// nextjs convention for variable in url
// http://localhost:3000/change-password/[token]
import { Button } from "@chakra-ui/button";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Link,
} from "@chakra-ui/react";
import { Box } from "@chakra-ui/layout";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter();
  const [, changePasword] = useChangePasswordMutation();
  const [tokenError, setTokenError] = useState("");
  const invalidPass = [
    {
      field: "newPassword",
      message: "passwords dont match",
    },
  ];

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "", repeatPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          if (values.newPassword !== values.repeatPassword) {
            setErrors(toErrorMap(invalidPass));
            return;
          }
          const response = await changePasword({
            newPassword: values.newPassword,
            token,
          });
          // // response.data.register.errors -> if there is no data will throw an error (break the app)
          // // response.data?.register.errors -> if ther is no data will throw undefine
          // // optional chaining from typescript
          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              label="new password"
              placeholder="new password"
              type="password"
            />
            <Box mt={4}>
              <InputField
                name="repeatPassword"
                placeholder="repeatPassword"
                label="repeat password"
                type="password"
              />
            </Box>
            {tokenError && (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle mr={2}>{tokenError}!!</AlertTitle>
                <AlertDescription>
                  <NextLink href="/forgot-password">
                    <Link color="teal.500" href="#">
                      Change password
                    </Link>
                  </NextLink>
                </AlertDescription>
                <CloseButton position="absolute" right="8px" top="8px" />
              </Alert>
            )}
            <Button
              mt={4}
              isLoading={isSubmitting}
              type="submit"
              color="green.500"
            >
              change password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

// get any query parameters and use in the function
ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient, { ssr: false })(ChangePassword);
