
app.controller("dawCtrl", ['$scope','$upload','$http',function($scope, $upload, $http){

    function getPolicy(){

    }

    function getSignature(){

    }

    $scope.$watch('files', function () {
        upload($scope.files);
    });

    function testAPI(file){

        $upload.upload({
            url: '/audio',
            file: file
        }).success(function (data, status, headers, config) {
            $scope.message = data;
        });
    }

    function upload(files){
        if (files && files.length) {
            testAPI(files[0]);
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                // Here we must decide whether we should upload through the front end or the back end.
                // for a small project I would say the backend. For a large product, the front end,
                // Lets start with the back end, and change it as our needs grow. Priority is getting a demo out there

                    // Code for an upload to the backend


                    // Code for a front end upload
                //$upload.upload({
                //    url: 'https://stereodrive.dev.s3.amazonaws.com/', //S3 upload url including bucket name
                //    method: 'POST',
                //    fields: {
                //        key: file.name, // the key to store the file on S3, could be file name or customized
                //        AWSAccessKeyId: "",
                //        acl: 'private', // sets the access to the uploaded file in the bucket: private or public
                //        policy: $scope.policy, // base64-encoded json policy (see article below)
                //        signature: $scope.signature, // base64-encoded signature based on policy string (see article below)
                //        "Content-Type": file.type != '' ? file.type : 'application/octet-stream', // content type of the file (NotEmpty)
                //        filename: file.name // this is needed for Flash polyfill IE8-9
                //    },
                //    file: file
                //});
            }
        }
    }


}]);