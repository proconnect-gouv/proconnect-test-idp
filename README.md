# ProConnect Test IDP

## Overview

ProConnect Test IDP is a test identity provider for the ProConnect application ecosystem.

## Installation

```bash
npm install
```

## Usage

```bash
npm build
npm start
```

Then go to: http://localhost:3000/auth?scope=openid+uid+given_name+usual_name+email+siren+siret+organizational_unit+belonging_population+phone+chorusdt&nonce=H3W97NNy0wHIsvYLeAx0MHtBoRavc4YF41wIVDESn9w&state=UOu3TnexaHvNMSRfQ05ASdMT_M1xHFOIY6eoN5RtwZ4&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fapi%2Fv2%2Foidc-callback&acr_values=eidas1&login_hint=user%40test.proconnect.gouv.fr&sp_id=ef16b50d-ca12-43c4-ac1f-c0a536979457&sp_name=Plateforme+de+test+-+ProConnect&remember_me=true&claims=%7B%22id_token%22%3A%7B%22amr%22%3Anull%2C%22acr%22%3Anull%7D%7D&client_id=client_id&response_type=code

Disconnect url:

http://localhost:3000/session/end?post_logout_redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fapi%2Fv2%2Fclient%2Flogout-callback
