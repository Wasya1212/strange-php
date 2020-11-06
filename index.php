<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>User list page - Bootdey.com</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="bootstrap.min.css" rel="stylesheet">
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="container">
<div class="row">
  <div class="panel-body">
    <div class="form-group">
      <label class="col-sm-2 control-label">Select status</label>
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
        <button type="button" class="btn btn-primary add-user-btn" data-toggle="modal" data-target="#exampleModal">
          Add new User
        </button>
      </div>
    </div>
  </div>
	<div class="col-lg-12">
		<div class="main-box clearfix">
			<div class="table-responsive">
				<table class="table user-list">
					<thead>
						<tr>
              <th>
                <div class="input-group-text">
                  <input class="group-operations" type="checkbox" aria-label="Checkbox for following text input">
                </div>
              </th>
							<th><span>User</span></th>
							<th class="text-center"><span>Status</span></th>
							<th><span>Role</span></th>
							<th>&nbsp;</th>
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
  <div class="form-group">
    <label class="col-sm-2 control-label">Select status</label>
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
      <button type="button" class="btn btn-primary add-user-btn" data-toggle="modal" data-target="#exampleModal">
        Add new User
      </button>
    </div>
  </div>
</div>
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form class="form-horizontal">
          <div class="panel panel-default">
            <div class="panel-heading">
            <h4 class="panel-title">User info</h4>
            </div>
            <div class="panel-body">
              <div class="form-group">
                <label class="col-sm-2 control-label">Select role</label>
                <div class="col-sm-10">
                  <select name="role" class="form-control">
                    <option value="user" selected="true">user</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-2 control-label">First name</label>
                <div class="col-sm-10">
                  <input required type="text" name="firstname" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-2 control-label">Last name</label>
                <div class="col-sm-10">
                  <input required type="text" name="lastname" class="form-control">
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-4 control-label">Status (active/inactive)</label>
                <div class="col-sm-8 status-radio-checkers">
                  <input type="radio" checked name="status" value="true" class="form-control active-status">
                  <input type="radio" name="status" value="" class="form-control inactive-status">
                </div>
              </div>
              <div class="form-group">
                <div class="col-sm-10">
                  <button type="submit" class="btn btn-primary">Save changes</button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    </div>
  </div>
</div>
</div>
<script src="jquery.min.js"></script>
<script src="bootstrap.min.js"></script>
<script src="main.js" type="text/javascript"></script>
</body>
</html>
