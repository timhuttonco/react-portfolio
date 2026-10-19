---
title: "Google Launches a User Groups Admin API for GA4 and Google Marketing Platform"
description: "Google added fourteen new methods to the Google Marketing Platform Admin API in alpha this month, all of them for managing user groups and organisation-level access in Google Analytics and Google Marketing Platform. For the first time, an admin can create and manage a user group, manage who's in it, and grant organisation-level roles entirely through API, rather than clicking through the admin UI one person at a time."
image: "/images/blog/gmp-admin-api.png"
---

<img src="/images/blog/gmp-admin-api.png" alt="Google Launches a User Groups Admin API for GA4 and Google Marketing Platform" width="100%">

### Google Launches a User Groups Admin API for GA4 and Google Marketing Platform

Google added fourteen new methods to the <a href="https://developers.google.com/marketing-platform/devguides/api/admin/v1/rest/v1alpha/organizations.userGroups" target="_blank" rel="noopener">Google Marketing Platform Admin API</a> in alpha this month, all of them for managing user groups and organisation-level access in <a href="https://marketingplatform.google.com/about/analytics/" target="_blank" rel="noopener">Google Analytics</a> and Google Marketing Platform. For the first time, an admin can create and manage a user group, manage who's in it, and grant organisation-level roles entirely through API, rather than clicking through the admin UI one person at a time.

#### What the API Does

The fourteen methods are split into three resources:

- **`organizations.userGroups`**: Create, get, list, patch, and delete a user group (5 methods).
- **`organizations.userGroups.members`**: Create, get, list, patch, and delete a group's membership (5 methods).
- **`organizations.adminAccessBindings`**: Create, get, list, and patch organisation-level role grants (4 methods).

The gain here is both structural and time-saving. Grant a role to a group once, then change who's in the group, and the access change propagates automatically. Groups can nest: a `UserGroupMember` can be either a person (identified by `userEmail`) or another group (identified by `userGroup`), so a regional team's group can sit inside a global team's group and mirror how the organisation is actually structured, rather than every person getting an individually assigned role that nobody remembers granting six months later.

#### How to Call It

Three requests cover the core workflow. All of them need the `https://www.googleapis.com/auth/marketingplatformadmin.analytics.update` OAuth scope.

**Create a user group.** `POST` to `organizations.userGroups`, under a specific organisation:

```
POST https://marketingplatformadmin.googleapis.com/v1alpha/organizations/{org_id}/userGroups

{
  "displayName": "EMEA Client Team",
  "description": "Agency staff working on EMEA retail accounts"
}
```

A `UserGroup` only has three fields: `name` (its resource path, assigned by Google on creation, in the format `organizations/{org_id}/userGroups/{user_group_id}`), `displayName`, and `description`. Nothing about roles or members lives on the group itself.

**Add a member.** `POST` to that group's `members` collection:

```
POST https://marketingplatformadmin.googleapis.com/v1alpha/organizations/{org_id}/userGroups/{user_group_id}/members

{
  "userEmail": "example@birdandbear.io",
  "membershipRole": "MEMBERSHIP_ROLE_MEMBER"
}
```

`membershipRole` is either `MEMBERSHIP_ROLE_MEMBER` (receives the group's assigned permissions) or `MEMBERSHIP_ROLE_OWNER` (can also add and remove members). To nest one group inside another instead of adding a person, send `userGroup` (the other group's resource name) instead of `userEmail`:

```
POST https://marketingplatformadmin.googleapis.com/v1alpha/organizations/{org_id}/userGroups/{parent_group_id}/members

{
  "userGroup": "organizations/{org_id}/userGroups/{child_group_id}",
  "membershipRole": "MEMBERSHIP_ROLE_MEMBER"
}
```

**Grant the group an organisation-level role.** `POST` to `adminAccessBindings`:

```
POST https://marketingplatformadmin.googleapis.com/v1alpha/organizations/{org_id}/adminAccessBindings

{
  "userGroup": "organizations/{org_id}/userGroups/{user_group_id}",
  "organizationRoles": ["USER_ADMIN_ROLE"]
}
```

The three roles are `ORG_ADMIN_ROLE` (everything, and it automatically pulls in the other two), `USER_ADMIN_ROLE` (the Users section), and `BILLING_ADMIN_ROLE` (the Billing section). This same `AdminAccessBinding` resource also takes a `userEmail` instead of `userGroup`, so it works for granting a role to an individual person directly, not just a group.

#### What Isn't Available (at the Moment)

A few limits are worth knowing:

- **There's no `delete` method on `adminAccessBindings`:** Only `create`, `get`, `list`, and `patch` exist for that resource. To actually revoke the access, either `patch` the binding to clear its `organizationRoles`, or remove the group (or person) from membership if the binding was granted through a group. Neither is a single clean "revoke" call, so a full offboarding script needs to account for this.
- **It's alpha:** Method names and behavior can still change before this reaches general availability. Simply looking at the endpoints shows v1alpha in them which could change.
- **It requires User Admin or Org Admin rights to use:** Whatever credential gets wired up to run these scripts becomes a genuinely high-value target. A script that can grant roles to a whole group at once can also misfire at the same scale.

#### Who This Helps

For an agency managing GA4 across a dozen or more client accounts, this is the first real building block for scripting onboarding and offboarding, instead of doing it by hand in the admin console every time someone joins or leaves a client team. The same goes for a brand with a lot of marketing, agency, or freelancer churn: a group that maps to "current agency team" or "Q4 freelancers" means access expires when people leave the group, not when someone remembers to go and remove them.

It's not yet a complete access-management system. The missing `delete` method on access bindings means a full offboarding script still needs a manual or workaround step. Worth building with that limitation in mind rather than assuming the API covers the whole lifecycle.

#### What to Do About It

This is alpha, so we wouldn't rebuild a client's whole access process around it yet. But it's worth testing against a non-production account now, particularly the group-nesting behavior, before the next big client handover or team reshuffle happens the old way.

If you're already managing access for several GA4 properties by hand, this is also a reasonable prompt to map out what your actual access structure should look like, who needs what, grouped how, before scripting it.
