import pycountry


def all_countries():
    countr_list = []

    for e in pycountry.countries:
        countr_list.append((e.name, e.name))
    return countr_list
