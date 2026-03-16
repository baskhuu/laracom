@extends('layouts.admin.app')

@section('content')
    <!-- Main content -->
    <section class="content">
        @include('layouts.errors-and-messages')
        <div class="box">
            <form action="{{ route('admin.roles.store') }}" method="post" class="form">
                <div class="box-body">
                    {{ csrf_field() }}
                    <div class="form-group">
                        <label for="display_name">Name</label>
                        <input type="text" name="display_name" id="display_name" placeholder="Display name" class="form-control" value="{{ old('display_name') }}">
                    </div>
                    <div class="form-group">
                        <label for="description">Description</label>
                        <input id="description" type="hidden" name="description" value="{{ old('description') }}">
                        <trix-editor input="description"></trix-editor>
                    </div>
                </div>
                <!-- /.box-body -->
                <div class="box-footer">
                    <div class="btn-group">
                        <div class="btn-group">
                            <a href="{{ route('admin.roles.index') }}" class="btn btn-default">Back</a>
                            <button type="submit" class="btn btn-primary">Create</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <!-- /.box -->

    </section>
    <!-- /.content -->
@endsection
