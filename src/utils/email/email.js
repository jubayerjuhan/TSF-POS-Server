import SibApiV3Sdk from "sib-api-v3-sdk";
import "dotenv/config";

/**
 * Sends a transactional email using the Sendinblue API.
 * @param {Array<{email: string, name?: string}>} recipient - The email address(es) of the recipient(s) and, optionally, their name(s).
 * @param {number} templateId - The ID of the email template to use.
 * @param {Object} params - The custom parameters to pass to the email template.
 * @param {Object[]} [attachment] - The file attachments to include in the email, if any.
 * @returns {Promise<Object>} - A Promise that resolves to the API response data or rejects with an error.
 */

const sendEmail = async (recipient, templateId, params, attachments) => {
  // setting up SIB Client Instance
  let defaultClient = SibApiV3Sdk.ApiClient.instance;
  let apiKey = defaultClient.authentications["api-key"];

  // configuring api key
  apiKey.apiKey = process.env.SIB_API_KEY;

  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  // setting up template id
  sendSmtpEmail.templateId = templateId;
  // sender
  sendSmtpEmail.sender = {
    name: `${process.env.COMPANY_NAME}`,
    email: `${process.env.COMPANY_EMAIL}`,
  };
  // reciever
  sendSmtpEmail.to = recipient;
  sendSmtpEmail.replyTo = {
    name: `${process.env.COMPANY_NAME}`,
    email: `${process.env.COMPANY_EMAIL}`,
  };

  // attachment
  sendSmtpEmail.attachment = attachments;
  // setting params
  sendSmtpEmail.params = params;

  apiInstance.sendTransacEmail(sendSmtpEmail).then(
    function (data) {
      console.log(
        "API called successfully. Returned data: " + JSON.stringify(data)
      );
    },
    function (error) {
      console.error(error);
    }
  );
};

export default sendEmail;
