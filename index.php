<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>User list page - Bootdey.com</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- <link href="bootstrap.min.css" rel="stylesheet"> -->

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">

    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="container">
<div class="panel-body">
  <div class="form-group row">
    <label class="col-sm-2 control-label col-form-label">Group operations</label>
    <div class="col-sm-3">
      <select name="operations" class="form-control">
        <option selected="true">please select</option>
        <option value="set-active">set active</option>
        <option value="set-no-active">set no active</option>
        <option value="delete">delete</option>
      </select>
    </div>
    <div class="col-sm-3">
      <button type="button" class="btn btn-primary multi-ops-btn">OK</button>
      <button type="button" class="btn btn-primary add-user-btn" data-toggle="modal" data-target="#userDataModal">
        Add new User
      </button>
    </div>
  </div>
</div>
<div class="row">
	<div class="col-lg-12">
		<div class="main-box clearfix">
			<div class="table-responsive">
				<table border="0" cellspacing="0" cellpadding="0" class="table user-list">
					<thead>
						<tr scope="row">
              <th scope="col">
                <input class="group-operations" type="checkbox" aria-label="Checkbox for following text input">
              </th>
							<th scope="col"><span>User</span></th>
							<th scope="col" class="text-center"><span>Status</span></th>
							<th scope="col"><span>Role</span></th>
							<th scope="col">&nbsp;</th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>
			</div>
			<ul class="pagination pull-right"></ul>
		</div>
	</div>
</div>
<div class="panel-body">
  <div class="form-group row">
    <label class="col-sm-2 control-label col-form-label">Group operations</label>
    <div class="col-sm-3">
      <select name="operations" class="form-control">
        <option selected="true">please select</option>
        <option value="set-active">set active</option>
        <option value="set-no-active">set no active</option>
        <option value="delete">delete</option>
      </select>
    </div>
    <div class="col-sm-3">
      <button type="button" class="btn btn-primary multi-ops-btn">OK</button>
      <button type="button" class="btn btn-primary add-user-btn" data-toggle="modal" data-target="#userDataModal">
        Add new User
      </button>
    </div>
  </div>
</div>

  <div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="errorModalLabel"></h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-dismiss="modal">Understand</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="confirmModalLabel">Are you shore?</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-footer"></div>
    </div>
  </div>
</div>

<div class="modal fade" id="userDataModal" tabindex="-1" aria-labelledby="userDataModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="userDataModalLabel">New message</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form id="user-data-form">
          <div class="form-group">
            <label for="user-role-select" class="col-form-label">Select role</label>
            <select id="user-role-select" name="role" class="form-control">
              <option value="user" selected="true">user</option>
              <option value="admin">admin</option>
            </select>
          </div>

          <div class="form-group">
            <label for="user-firstname-input" class="col-form-label">First name</label>
            <input id="user-firstname-input" required type="text" name="firstname" class="form-control">
          </div>

          <div class="form-group">
            <label for="user-lastname-input" class="col-form-label">Last name</label>
            <input id="user-lastname-input" required type="text" name="lastname" class="form-control">
          </div>

          <div class="form-group google-checker-container">
            <label for="user-status-checkbox" class="col-form-label">Status</label>
            <input id="user-status-checkbox" type="checkbox" name="status" value="true" class="form-control" controller="google-checker">
            <div class="google-checker"></div>
          </div>

          <button class="invisible button" type="submit" name="button" hidden>submit</button>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button id="submit-user-data-btn" type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>

</div>
</div>
<script src="jquery.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx" crossorigin="anonymous"></script>
<script src="js/user-controller.js"></script>
<script src="main.js" type="text/javascript"></script>
</body>
</html>
