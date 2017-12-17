from setuptools import setup, find_packages


version = __import__('graphql_utils').__version__

setup(
    name='django-graphql-utils',
    packages=find_packages(),
    include_package_data=True,
    version=version,
    description='Utilities to work with Graphql in Django ',
    author='synw',
    author_email='synwe@yahoo.com',
    url='https://github.com/synw/django-graphql-utils',
    download_url='https://github.com/synw/django-graphql-utils/releases/tag/' + version,
    keywords=['django', 'graphql'],
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Framework :: Django :: 1.11',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3.5',
    ],
    install_requires=[
        "graphene",
        "graphene_django",
        "django-filters",
    ],
    zip_safe=False
)
