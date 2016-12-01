import uiModules from 'ui/modules';

const module = uiModules.get('security', []);
module.constant('shieldPrivileges', {
  cluster: [
    'all',
    'monitor',
    'manage',
    'manage_security',
    'manage_index_templates'
  ],
  indices: [
    'all',
    'manage',
    'monitor',
    'read',
    'index',
    'create',
    'delete',
    'write',
    'delete_index',
    'create_index',
    'view_index_metadata'
  ]
});
