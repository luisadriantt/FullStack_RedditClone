// nextjs convention for variable in url
// http://localhost:3000/change-password/[token]
import { Button } from "@chakra-ui/button";
import { Box } from "@chakra-ui/layout";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import React from "react";
import { router } from "websocket";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { toErrorMap } from "../../utils/toErrorMap";
import login from "../login";

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "", repeatPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          // const response = await login(values);
          // // response.data.register.errors -> if there is no data will throw an error (break the app)
          // // response.data?.register.errors -> if ther is no data will throw undefine
          // // optional chaining from typescript
          // if (response.data?.login.errors) {
          //   setErrors(toErrorMap(response.data.login.errors));
          // } else if (response.data?.login.user) {
          //   router.push("/");
          // }
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

  // get any query parameters and use in the function
  ChangePassword.getInitialProps = ({ query }) => {
    return {
      token: query.token as string,
    };
  };
};

export default ChangePassword;
