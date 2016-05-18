(function() {
    'use strict';

    angular
        .module('carOwnerProjectApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('owner', {
            parent: 'entity',
            url: '/owner?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Owners'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/owner/owners.html',
                    controller: 'OwnerController',
                    controllerAs: 'vm'
                }
            },
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'id,asc',
                    squash: true
                },
                search: null
            },
            resolve: {
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    return {
                        page: PaginationUtil.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: PaginationUtil.parsePredicate($stateParams.sort),
                        ascending: PaginationUtil.parseAscending($stateParams.sort),
                        search: $stateParams.search
                    };
                }]
            }
        })
        .state('owner-detail', {
            parent: 'entity',
            url: '/owner/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Owner'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/owner/owner-detail.html',
                    controller: 'OwnerDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Owner', function($stateParams, Owner) {
                    return Owner.get({id : $stateParams.id});
                }]
            }
        })
        .state('owner.new', {
            parent: 'owner',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/owner/owner-dialog.html',
                    controller: 'OwnerDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                firstname: null,
                                lastname: null,
                                birthyear: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('owner', null, { reload: true });
                }, function() {
                    $state.go('owner');
                });
            }]
        })
        .state('owner.edit', {
            parent: 'owner',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/owner/owner-dialog.html',
                    controller: 'OwnerDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Owner', function(Owner) {
                            return Owner.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('owner', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('owner.delete', {
            parent: 'owner',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/owner/owner-delete-dialog.html',
                    controller: 'OwnerDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Owner', function(Owner) {
                            return Owner.get({id : $stateParams.id});
                        }]
                    }
                }).result.then(function() {
                    $state.go('owner', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
